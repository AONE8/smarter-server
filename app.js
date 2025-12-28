import { createWriteStream } from "fs";
import path from "path";
import express, { json } from "express";
import cors from "cors";
import { config } from "dotenv";
import puppeteerExtra from "puppeteer-extra";
import morgan from "morgan";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { fileURLToPath } from "url";

import db from "./models/index.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import questionRoutes from "./routes/question.routes.js";
import deviceRoutes from "./routes/device.routes.js";

config();
puppeteerExtra.use(StealthPlugin());

const PORT = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const accessLogStream = createWriteStream(path.join(__dirname, "access.log"), {
  flags: "a",
});

app.use(morgan("combined", { stream: accessLogStream }));
app.use(morgan("dev"));

app.use(cors());
app.use(json());

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/search", questionRoutes);
app.use("/device", deviceRoutes);

app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).json({ errors: [{ message: "Internal Server Error" }] });
});

db.sequelize
  .sync()
  .then(() => {
    console.log("Database synchronized.");
    app.listen(PORT, () => console.log("Server is running on port " + PORT));
  })
  .catch((err) => {
    console.error("Error synchronizing the database:", err);
  });
