import "dotenv/config";
import express from "express";
import cors from "cors";
import authRoutes from "../server/routes/authRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/user", authRoutes);

export default app;
