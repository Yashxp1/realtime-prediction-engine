import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { env } from "./config/env.js";
import authRoute from "./modules/auth/auth.route.js";

const app = express();
app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.use("/v1/auth", authRoute);

app.listen(env.PORT, () => {
  console.log(`Server started on PORT: ${env.PORT}`);
});
