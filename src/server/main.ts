import express from "express";
import ViteExpress from "vite-express";
import path from "path";
import fs from "fs/promises";

const app = express();

// Route to serve files based on facilityID
app.get("/menus/:facilityID", async function (req, res) {
  const facilityID = req.params.facilityID;
  const filePath = path.join(
    __dirname,
    `/menus-as-json/menus-facility-${facilityID}.json`
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

// example route which returns a message
app.get("/hello", async function (_req, res) {
  res.status(200).json({ message: "Hello World!" });
});

// Do not change below this line
ViteExpress.listen(app, 5173, () =>
  console.log("Server is listening on http://localhost:5173")
);
