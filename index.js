import express from "express";
import dotenv from "dotenv";
import dbConnect from "./DB/dbConnect.js";
import authUser from "./Route/authUser.js";
import messageRoute from "./Route/messageRoute.js";
import cookieParser from "cookie-parser";
import userRoute from "./Route/userRoute.js";
import path from "path";
import cors from "cors";
import { app, server } from "./Socket/socket.js";

const __dirname = path.resolve();

dotenv.config();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authUser);
app.use("/api/message", messageRoute);
app.use("/api/user", userRoute);

/*app.use(express.static(path.join(__dirname, "/frontend/dist")));

app.get(/^\/(?!api)., (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
}); */

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  dbConnect();
  console.log(`Working at ${PORT}`);
});
