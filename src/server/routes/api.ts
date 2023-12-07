import express, { Request, Response } from "express";
import fs from "fs";
import path from "path";

const router = express.Router();
const dataFilePath = path.join(__dirname, "../data.txt");

// Helper function to read and parse the data file
const readData = (): {
  id: number;
  name: string;
  username: string;
  email: string;
  password: string;
  favMenus: string[];
}[] => {
  try {
    const data = fs.readFileSync(dataFilePath, "utf8");
    return JSON.parse(data);
  } catch (err) {
    // If the file does not exist or is empty, return an empty array
    return [];
  }
};

// Helper function to write data to the file
const writeData = (data: any) => {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), "utf8");
};

// POST route for /api/users
router.post("/users", (req: Request, res: Response) => {
  const { name, username, email, password } = req.body;

  if (!username || !password) {
    res.status(400).send("Username and password are required");
    return;
  }

  const users = readData();

  // Check if username or email already exists
  const isUsernameExist = users.some((user) => user.username === username);
  const isEmailExist = users.some((user) => user.email === email);

  if (isUsernameExist) {
    res.status(400).send("Username already exists");
    return;
  }

  if (isEmailExist) {
    res.status(400).send("Email already exists");
    return;
  }

  const newId = users.length + 1; // Simple ID generation
  const newUser = { id: newId, name, username, email, password, favMenus: [] };

  users.push(newUser);
  writeData(users);

  res.status(200).json({ message: "User added", newUser });
});

// In your Express router file

// POST route for /api/authenticate
router.post("/authenticate", (req, res) => {
  const { username, password } = req.body;
  const users = readData();

  const user = users.find(
    (user) => user.username === username && user.password === password
  );

  if (user) {
    req.session.userId = user.id;
    req.session.userName = user.username;
    req.session.favMenus = user.favMenus;
    res.status(200).json({ message: "Authentication successful", user });
  } else {
    res.status(401).json({ message: "Authentication failed" });
  }
});

// Don't forget to export the router and include it in your Express app

export default router;
