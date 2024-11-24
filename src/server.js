import express from "express";
import { configDotenv } from "dotenv";
import cors from "cors";
import identifyUser from "./routes/identifyUser.js";
import user from "./routes/user.js";
import { connectDB } from "./config/db.js";
import axios from "axios";

configDotenv();
const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 1002;

app.get("/", (req, res) => {
  res.send("Hello from Server");
});

app.use("/identify", identifyUser);
app.use("/getAllUser", user);

// Keep-alive endpoint
app.get("/keep-alive", (req, res) => {
  console.log("alive");
  res.send("Server is alive!");
});

// Function to call the keep-alive endpoint
const keepServerAlive = async () => {
  try {
    const url = `identity-reconciliation-server-api.onrender.com/keep-alive`;
    await axios.get(url);
    console.log(`Keep-alive ping sent to ${url}`);
  } catch (error) {
    console.error("Error sending keep-alive ping:", error.message);
  }
};

// Start the keep-alive pings every minute
setInterval(keepServerAlive, 1 * 60 * 1000);
keepServerAlive();

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is listening at ${PORT}`);
  });
});
