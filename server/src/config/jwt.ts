import jwt from "jsonwebtoken";
import { env } from "./env.js";
import type { Response } from "express";

export type Payload = {
  id: number;
  username: string;
  age: number;
};

export const generateToken = (payload: Payload, res: Response) => {
  try {
    const token = jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: "7d",
    });

    if (!token) {
      throw new Error("Token not found!");
    }

    res.cookie("jwt", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  } catch (error) {
    console.log(error);
  }
};

export const verifyToken = (token: string) => {
  try {
    if (!token) {
      throw new Error("Token is required");
    }

    const decoded = jwt.verify(token, env.JWT_SECRET) as Payload;
    return decoded;
  } catch (error) {
    console.log(error);
  }
};
