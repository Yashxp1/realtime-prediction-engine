import type { Request, Response } from "express";
import { prisma } from "../../config/db.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../../config/jwt.js";
import { env } from "../../config/env.js";
import jwt from "jsonwebtoken";

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, username, password, age } = req.body;

    if (!name || !username || !password || !age) {
      res.status(400).json({ error: "all the fields are required" });
      return;
    }

    if (age < 18) {
      res
        .status(400)
        .json({ error: "You must be at least 18 years to contniue" });
      return;
    }

    const exisitingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (exisitingUser) {
      res.status(409).json({ error: "Username already exisits" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        username,
        age,
        password: hashedPassword,
      },
    });

    res.status(201).json({
      message: "User created successfully",
      user: { id: newUser.id, username: newUser.username },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ error: "all the fields are required" });
      return;
    }

    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (!user) {
      res.status(401).json({ error: "Invalid username or password" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ error: "Invalid username or password" });
      return;
    }

    const payload = { id: user.id, username: user.username, age: user.age };
    const token = generateToken(payload, res);

    res.json({
      message: "Login successful",
      user: {
        user: user.id,
        name: user.name,
        username: user.username,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const isLoggedIn = async (req: Request, res: Response) => {
  try {
    const token = req.cookies?.jwt;

    if (!token) {
      return res.status(400).json({ authenticated: false });
    }

    jwt.verify(token, env.JWT_SECRET);

     return res.status(200).json({ authenticated: true , token});

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const logOut = async (req: Request, res: Response) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res
      .status(201)
      .json({ success: false, message: "User logged out successfully" });
  } catch (error) {
    console.error("Error in logout controller", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
