import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { generateToken } from "../../config/jwt.js";
import { env } from "../../config/env.js";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../../shared/asyncHandler.js";
import { AppError } from "../../shared/AppError.js";
import { prisma } from "../../db/prisma.js";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, username, password, age } = req.body;

  if (!name || !username || !password || !age) {
    throw new AppError("All fields are required", 400);
  }

  if (age < 18) {
    throw new AppError("You must be at least 18 years old to continue", 400);
  }

  const existingUser = await prisma.user.findUnique({
    where: { username },
  });

  if (existingUser) {
    throw new AppError("Username already exists", 409);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: {
      name,
      username,
      age,
      password: hashedPassword,
      accountStatus: "VERIFIED",
    },
  });

  res.status(201).json({
    success: true,
    message: "User created successfully",
    user: {
      id: newUser.id,
      username: newUser.username,
    },
  });
});

export const login = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { username, password } = req.body;

    if (!username || !password) {
      throw new AppError("all the fields are required", 400);
    }

    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (!user) {
      throw new AppError("Invalid username or password", 409);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AppError("Invalid username or password", 409);
    }

    const payload = { id: user.id, username: user.username, age: user.age };
    const token = generateToken(payload, res);

    res.status(201).json({
      message: "Login successful",
      user: {
        user: user.id,
        name: user.name,
        username: user.username,
      },
      token,
    });
  },
);

export const isLoggedIn = asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies?.jwt;

  if (!token) {
    throw new AppError("Invalid token", 401);
  }

  jwt.verify(token, env.JWT_SECRET);

  return res.status(200).json({ authenticated: true, token });
});

export const logOut = asyncHandler(async (req: Request, res: Response) => {
  res.cookie("jwt", "", { maxAge: 0 });
  res
    .status(201)
    .json({ success: false, message: "User logged out successfully" });
});
