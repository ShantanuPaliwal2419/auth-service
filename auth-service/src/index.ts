import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";
import { testDatabaseConnection } from "./databaseConnection/database-connection";
import { jwtBootstrap } from "./utils/jwtBootstrap";
import userrouter from "./Routes/user.routes";

const app = express();

/* ---------- Middlewares ---------- */
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
testDatabaseConnection()
await jwtBootstrap()
app.use("/user", userrouter)
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

/* ---------- Health Check ---------- */
app.get("/health", (_req, res) => {
  res.json({ status: "OK" });
});

/* ---------- Server ---------- */
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 Auth service running on port ${PORT}`);
});
