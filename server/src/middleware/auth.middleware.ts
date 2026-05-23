import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import type { Payload } from "../config/jwt.js";
import { env } from "../config/env.js";
import { prisma } from "../config/db.js";

export const protectRoute = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies?.jwt;
    if (!token) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
      });
    }

    const decoded = jwt.verify(token, env.JWT_SECRET) as Payload;

    const user = await prisma.user.findUnique({
      where: {
        username: decoded.username,
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
      });
    }

    (req as any).user = user;

    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      success: false,
      error: "Unauthorized",
    });
  }
};
