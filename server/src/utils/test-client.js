import { io } from "socket.io-client";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

const socket = io("http://localhost:8777", {
  path: "/socket.io",
  auth: {
    token: process.env.JWT_SECRET, 
  },
});

socket.on("connect", () => {
  console.log("Connected to server with socket ID:", socket.id);
});

socket.on("connect_error", (err) => {
  console.error("Connection error:", err.message);
});

socket.on("disconnect", () => {
  console.log("Disconnected from server");
});

