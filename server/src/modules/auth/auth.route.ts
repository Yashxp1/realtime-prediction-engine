import express from "express";
import { protectRoute } from "../../middleware/auth.middleware.js";
import { isLoggedIn, login, logOut, register } from "./auth.controller.js";

const authRoute = express.Router();

authRoute.post("/register", register);
authRoute.post("/login", login);
authRoute.post("/check-auth", isLoggedIn);
authRoute.get("/logout", logOut);


export default authRoute;