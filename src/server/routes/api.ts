import express, { Request, Response } from "express";
import User from "../models/user";

const router = express.Router();

// POST route for /api/register
router.post("/register", async (req: Request, res: Response) => {
  const { name, username, email, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Missing information!" });
  }

  try {
    const usernameExists = await checkUsernameExists(username);
    if (usernameExists) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const emailExists = await checkEmailExists(email);
    if (emailExists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const userCount = await countUsers();
    const newID = userCount + 1;

    const newUser = new User({
      id: newID,
      name: name,
      username: username,
      email: email,
      password: password,
      favouriteMenus: [],
      favouriteMensas: [7, 9],
      allergens: ["Gluten", "Milch"],
    });

    await newUser.save();
    return res.status(200).json({ message: "Successfully registered!" });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// POST route for /api/authenticate
router.post("/authenticate", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required!" });
  }

  try {
    const [exists, userID] = await authenticateUser(username, password);

    if (exists) {
      req.session.userId = userID;
      return res.status(200).json({ message: "Authentication successful!" });
    } else {
      return res.status(401).json({ message: "Wrong username or password" });
    }
  } catch (error) {
    console.error("Error authenticating user:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

async function checkUsernameExists(usernameToCheck: string) {
  try {
    const existingUser = await User.findOne({ username: usernameToCheck });

    if (existingUser) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error checking username:", error);
    throw error;
  }
}

async function checkEmailExists(emailToCheck: string) {
  try {
    const existingUser = await User.findOne({ email: emailToCheck });

    if (existingUser) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error checking email:", error);
    throw error;
  }
}

async function countUsers() {
  try {
    const userCount = await User.countDocuments();
    return userCount;
  } catch (error) {
    console.error("Error counting users:", error);
    throw error;
  }
}

async function authenticateUser(
  usernameToCheck: string,
  passwordToCheck: string
) {
  try {
    const existingUser = await User.findOne({
      username: usernameToCheck,
      password: passwordToCheck,
    });

    if (existingUser) {
      return [true, existingUser.id];
    } else {
      return [false, -1];
    }
  } catch (error) {
    console.error("Error authenticating user:", error);
    throw error;
  }
}

export default router;
