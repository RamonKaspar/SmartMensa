import express from "express";
import ViteExpress from "vite-express";
import path from "path";
import fs from "fs/promises";
import apiRoutes from "./routes/api";
import session from "express-session";
import { spawn } from "child_process";
import cron from "node-cron";

const app = express();

app.use(express.json());

// Configure session middleware
app.use(
  session({
    secret: "your-secret-key", // Replace with a secure key
    resave: false,
    saveUninitialized: true,
    cookie: { httpOnly: true, secure: false }, // Set secure to true if using HTTPS
  })
);

app.use("/api", apiRoutes);

app.get("/api/current-user", (req, res) => {
  if (req.session && req.session.userId) {
    res.json({ userId: req.session.userId });
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

const pythonScriptPathUZH = path.join(__dirname, "menu_scraper_uhz.py");
const pythonScriptPathETH = path.join(__dirname, "menu_scraper_eth.py");
const pythonInterpreter = "/usr/bin/python3";

// Schedule the execution of the menu scraper scripts (ETH and UZH) every Monday at 00:05
cron.schedule(
  "5 0 * * *", // Run every day at 00:05
  () => {
    console.log("Fetching new UZH menus...");
    serverLogs.push({
      timestamp: new Date().toISOString(),
      logs: ["Fetching new UZH menus..."],
    });

    // Spawn a new python process to run the menu scraper script for UZH
    const pythonProcess_uzh = spawn(pythonInterpreter, [pythonScriptPathUZH]);

    pythonProcess_uzh.stdout.on("data", (data) => {
      const output = data.toString().trim();
      console.log(output);
      serverLogs.push({
        timestamp: new Date().toISOString(),
        logs: [output],
      });
    });

    pythonProcess_uzh.stderr.on("data", (data) => {
      console.error(`Python script stderr: ${data}`);
      serverLogs.push({
        timestamp: new Date().toISOString(),
        logs: ["Python script stderr: " + data],
      });
    });

    pythonProcess_uzh.on("close", (code) => {
      console.log(`Python script process exited with code ${code}`);
      serverLogs.push({
        timestamp: new Date().toISOString(),
        logs: ["Python script process exited with code " + code],
      });
    });

    serverLogs.push({
      timestamp: new Date().toISOString(),
      logs: ["Fetching new ETH menus..."],
    });

    // Spawn a new python process to run the menu scraper script for ETH
    const pythonProcess_eth = spawn(pythonInterpreter, [pythonScriptPathETH]);

    pythonProcess_eth.stdout.on("data", (data) => {
      const output = data.toString().trim();
      console.log(output);
      serverLogs.push({
        timestamp: new Date().toISOString(),
        logs: [output],
      });
    });

    pythonProcess_eth.stderr.on("data", (data) => {
      console.error(`Python script stderr: ${data}`);
      serverLogs.push({
        timestamp: new Date().toISOString(),
        logs: ["Python script stderr: " + data],
      });
    });

    pythonProcess_eth.on("close", (code) => {
      console.log(`Python script process exited with code ${code}`);
      serverLogs.push({
        timestamp: new Date().toISOString(),
        logs: ["Python script process exited with code " + code],
      });
    });
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

// Do not change below this line
ViteExpress.listen(app, 5173, () =>
  console.log("Server is listening on http://localhost:5173")
);
