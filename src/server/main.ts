import express from "express";
import ViteExpress from "vite-express";
import path from "path";
import fs from "fs/promises";
import apiRoutes from "./routes/api";
import session from "express-session";
import { spawn } from "child_process";
import cron from "node-cron";
import mongoose from "mongoose";
import User from "./models/user";
import crypto from "crypto";
const uuid = require("uuid").v4;

const app = express();

app.use(express.json());

// Configure session middleware
app.use(
  session({
    secret: crypto.randomBytes(32).toString("hex"),
    resave: false,
    saveUninitialized: true,
    cookie: { httpOnly: true, secure: false }, // Set secure to true if using HTTPS
    genid: function (_req) {
      return uuid(); // Generate a new UUID as the session key
    },
  })
);

app.use("/api", apiRoutes);

app.get("/api/current-user", (req, res) => {
  if (req.session && req.session.userId && req.session.appliedSettings) {
    res.json({
      userId: req.session.userId,
      appliedSettings: req.session.appliedSettings,
    });
  } else {
    res.status(401).json({ message: "No user logged in" });
  }
});

// serverLog type
interface serverLog {
  timestamp: string;
  logs: string[];
}

const serverLogs: serverLog[] = [];
app.get("/serverlogs", (_req, res) => {
  // Send the serverLogs array as a JSON response
  res.json({ logs: serverLogs });
});

const pythonScriptPathUZH = path.join(__dirname, "menu_scraper_uzh.py");
const pythonScriptPathETH = path.join(__dirname, "menu_scraper_eth.py");
const pythonInterpreter = "/usr/bin/python3";

// Schedule the execution of Python scripts after the server starts
function runPythonScripts() {
  console.log("Fetching new UZH menus...");
  serverLogs.push({
    timestamp: new Date().toISOString(),
    logs: ["Fetching new UZH menus..."],
  });

  // Execute menu scraper script for UZH
  const pythonProcessUZH = spawn(pythonInterpreter, [pythonScriptPathUZH]);

  pythonProcessUZH.stdout.on("data", (data) => {
    const output = data.toString().trim();
    console.log(output);
    // Push stdout output to server logs
    serverLogs.push({
      timestamp: new Date().toISOString(),
      logs: [output],
    });
  });

  pythonProcessUZH.stderr.on("data", (data) => {
    console.error(`Python script stderr: ${data}`);
    // Push stderr output to server logs
    serverLogs.push({
      timestamp: new Date().toISOString(),
      logs: [`Python script stderr: ${data}`],
    });
  });

  pythonProcessUZH.on("close", (code) => {
    console.log(`Python script process (UZH) exited with code ${code}`);
    // Push process closure information to server logs
    serverLogs.push({
      timestamp: new Date().toISOString(),
      logs: [`Python script process (UZH) exited with code ${code}`],
    });

    console.log("Fetching new ETH menus...");
    serverLogs.push({
      timestamp: new Date().toISOString(),
      logs: ["Fetching new ETH menus..."],
    });

    // Execute menu scraper script for ETH after UZH script completion
    const pythonProcessETH = spawn(pythonInterpreter, [pythonScriptPathETH]);

    pythonProcessETH.stdout.on("data", (data) => {
      const output = data.toString().trim();
      console.log(output);
      // Push stdout output to server logs
      serverLogs.push({
        timestamp: new Date().toISOString(),
        logs: [output],
      });
    });

    pythonProcessETH.stderr.on("data", (data) => {
      console.error(`Python script stderr: ${data}`);
      // Push stderr output to server logs
      serverLogs.push({
        timestamp: new Date().toISOString(),
        logs: [`Python script stderr: ${data}`],
      });
    });

    pythonProcessETH.on("close", (code) => {
      console.log(`Python script process (ETH) exited with code ${code}`);
      // Push process closure information to server logs
      serverLogs.push({
        timestamp: new Date().toISOString(),
        logs: [`Python script process (ETH) exited with code ${code}`],
      });
    });
  });
}

// Schedule the execution of the menu scraper scripts (ETH and UZH) every Monday at 00:05
cron.schedule(
  "5 1 * * *", // Run every day at 01:05 (UTC+01:00)
  () => {
    runPythonScripts();
  },
  {
    scheduled: true,
    timezone: "Europe/Zurich",
  }
);

// Route to serve the mensa infos
app.get("/mensa-info", async function (_req, res) {
  const mensasFilePath = path.join(__dirname, "mensa-infos-static.json");

  try {
    // Check if the file exists
    await fs.access(mensasFilePath);
    // If the file exists, serve it
    res.sendFile(mensasFilePath);
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(404).json({ error: "File not found" });
  }
});

// Route to serve files based on facilityID
app.get("/menus/:facilityID", async function (req, res) {
  const facilityID = req.params.facilityID;
  const filePath = path.join(
    __dirname,
    `../../menus-as-json/menus-facility-${facilityID}.json`
  );

  try {
    // Check if the file exists
    await fs.access(filePath);

    // If the file exists, serve it
    res.sendFile(filePath);
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(404).json({ error: "File not found" });
  }
});

// Connect to MongoDB database
const dbURI =
  "***REMOVED_DB_URL***";
mongoose
  .connect(dbURI)
  .then(() => {
    console.log("Connected to MongoDB database");
  })
  .catch((err) => {
    console.log(err);
  });

// Route to get the users favourite menus from mongoDB database using mongoose
app.get("/serve-favourite-menus/:userID", async function (req, res) {
  // Get the users favourite menus from the database
  try {
    const userID = req.params.userID;

    // Check if user is logged in
    if (
      !req.session ||
      !req.session.userId ||
      req.session.userId.toString() !== userID
    ) {
      res.status(401).json({ error: "Not logged in" });
      return;
    }

    const user = await User.findOne({ id: userID });

    // Check if the user exists
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const favouriteMenus = user.favouriteMenus;
    // Send the favourite menus as a JSON response
    res.status(200).json({ favouriteMenus: favouriteMenus });
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: "Favourite menus not found" });
  }
});

// Route to add a new favorite menu for a user
app.post("/add-favorite-menu/:userID", async function (req, res) {
  try {
    const userID = req.params.userID;
    const newMenu = req.body;

    // Check if user is logged in
    if (
      !req.session ||
      !req.session.userId ||
      req.session.userId.toString() !== userID
    ) {
      res.status(401).json({ error: "Not logged in" });
      return;
    }

    const user = await User.findOne({ id: userID });

    // Check if the user exists
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // Add the new menu to the user's favoriteMenus array
    user.favouriteMenus.push(newMenu);

    // Save the updated user object
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "New favorite menu added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add new favorite menu" });
  }
});

// Route to delete a favorite menu entry by index for a user
app.delete("/delete-favourite-menu/:userID", async function (req, res) {
  try {
    const userID = req.params.userID;
    const index = req.body.index;

    // Check if user is logged in
    if (
      !req.session ||
      !req.session.userId ||
      req.session.userId.toString() !== userID
    ) {
      res.status(401).json({ error: "Not logged in" });
      return;
    }

    const user = await User.findOne({ id: userID });

    // Check if the user exists
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // Remove the menu entry at the specified index
    user.favouriteMenus.splice(index, 1);

    // Save the updated user object
    await user.save();

    res.status(200).json({
      success: true,
      message: "Favorite menu entry deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete favorite menu entry" });
  }
});

// Route to get the users applied settings from mongoDB database using mongoose
app.get("/serve-applied-settings/:userID", async function (req, res) {
  // Get the users applied settings from the database
  try {
    const userID = req.params.userID;

    // Check if user is logged in
    if (
      !req.session ||
      !req.session.userId ||
      req.session.userId.toString() !== userID
    ) {
      res.status(401).json({ error: "Not logged in" });
      return;
    }

    const user = await User.findOne({ id: userID });

    // Check if the user exists
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const appliedSettings = user.appliedSettings;
    // Send the applied settings as a JSON response
    res.status(200).json({ appliedSettings: appliedSettings });
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: "Applied settings not found" });
  }
});

// Route to change the applied settings for a user
app.post("/modify-applied-settings/:userID", async function (req, res) {
  try {
    const userID = req.params.userID;
    const newAppliedSettings = req.body;

    // Check if user is logged in
    if (
      !req.session ||
      !req.session.userId ||
      req.session.userId.toString() !== userID
    ) {
      res.status(401).json({ error: "Not logged in" });
      return;
    }

    const user = await User.findOne({ id: userID });

    // Check if the user exists
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // Add the new applied settings to the user's appliedSettings
    user.appliedSettings = newAppliedSettings;

    // Save the updated user object
    await user.save();

    res.status(200).json({
      success: true,
      message: "New applied settings added successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add new applied settings" });
  }
});

// Route to get the users favourite mensas from mongoDB database using mongoose
app.get("/serve-favourite-mensas/:userID", async function (req, res) {
  // Get the users favourite mensas from the database
  try {
    const userID = req.params.userID;

    // Check if user is logged in
    if (
      !req.session ||
      !req.session.userId ||
      req.session.userId.toString() !== userID
    ) {
      res.status(401).json({ error: "Not logged in" });
      return;
    }

    const user = await User.findOne({ id: userID });

    // Check if the user exists
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const favouriteMensas = user.favouriteMensas;
    // Send the favourite mensas as a JSON response
    res.status(200).json({ favouriteMensas: favouriteMensas });
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: "Favourite mensas not found" });
  }
});

// Route to change favourite mensas for a user in the database
app.post("/modify-favourite-mensas/:userID", async function (req, res) {
  try {
    const userID = req.params.userID;
    const newFavouriteMensas = req.body;

    // Check if user is logged in
    if (
      !req.session ||
      !req.session.userId ||
      req.session.userId.toString() !== userID
    ) {
      res.status(401).json({ error: "Not logged in" });
      return;
    }

    const user = await User.findOne({ id: userID });

    // Check if the user exists
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // Add the new favourite mensas to the user's favouriteMensas
    user.favouriteMensas = newFavouriteMensas;

    // Save the updated user object
    await user.save();

    res.status(200).json({
      success: true,
      message: "New favourite mensas added successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add new favourite mensas" });
  }
});

// Do not change below this line
ViteExpress.listen(app, 5173, () => {
  console.log("Server is listening on http://localhost:5173");
  // Log execution initiation in server logs
  console.log("Executing Python scripts after server start...");
  serverLogs.push({
    timestamp: new Date().toISOString(),
    logs: ["Executing Python scripts after server start..."],
  });

  // Execute the Python scripts after the server starts, with a delay of 5 seconds
  setTimeout(runPythonScripts, 5000);
});
