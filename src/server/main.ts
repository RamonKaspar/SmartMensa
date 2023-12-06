import express from "express";
import ViteExpress from "vite-express";
import path from "path";
import fs from "fs/promises";
// import { spawn } from "child_process";
// import cron from "node-cron";

const app = express();

// const pythonScriptPathUZH = path.join(__dirname, "menu_scraper_uhz.py");
// const pythonScriptPathETH = path.join(__dirname, "menu_scraper_eth.py");

// Schedule the execution of the menu scraper scripts (ETH and UZH) every Monday at 00:05
// cron.schedule(
//   // "5 0 * * 1", // Run every Monday at 00:05
//   "*/5 * * * *", // For testing purposes, run every 5 minutes
//   () => {
//     const logMessage = "Fetching new UZH menus..."; // Your log message
//     console.log(logMessage);

//     // Spawn a new python process to run the menu scraper script for UZH
//     const pythonProcess_uzh = spawn("python", [pythonScriptPathUZH]);

//     pythonProcess_uzh.stdout.on("data", (data) => {
//       const output = data.toString().trim();
//       console.log(output);
//     });

//     pythonProcess_uzh.stderr.on("data", (data) => {
//       console.error(`Python script stderr: ${data}`);
//     });

//     pythonProcess_uzh.on("close", (code) => {
//       console.log(`Python script process exited with code ${code}`);
//     });

//     console.log("Fetching new ETH menus...");
//     // Spawn a new python process to run the menu scraper script for ETH
//     const pythonProcess_eth = spawn("python", [pythonScriptPathETH]);

//     pythonProcess_eth.stdout.on("data", (data) => {
//       const output = data.toString().trim();
//       console.log(output);
//     });

//     pythonProcess_eth.stderr.on("data", (data) => {
//       console.error(`Python script stderr: ${data}`);
//     });

//     pythonProcess_eth.on("close", (code) => {
//       console.log(`Python script process exited with code ${code}`);
//     });
//   },
//   {
//     scheduled: true,
//     timezone: "Europe/Zurich",
//   }
// );

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
