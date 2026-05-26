import express from "express";
import { protectRoute } from "../../middleware/auth.middleware.js";
import {
  creditBalance,
  debitBalance,
  getBalance,
} from "./wallet.controller.js";

const walletRoute = express.Router();

walletRoute.post("/balance", protectRoute, getBalance);
walletRoute.post("/credit", protectRoute, creditBalance);
walletRoute.post("/debit", protectRoute, debitBalance);

export default walletRoute;
