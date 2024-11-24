import express from "express";
import { configDotenv } from "dotenv";
import cors from "cors";
import identifyUser from "./routes/identifyUser.js";
import { connectDB } from "./config/db.js";

configDotenv();
const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 1002;

app.get("/", (req, res) => {
  res.send("Hello from Server");
});

app.use("/identify", identifyUser);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is listening at ${PORT}`);
  });
});
