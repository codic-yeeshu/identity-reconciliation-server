import { prisma } from "../config/db.js";

export const identifyUserController = async (req, res) => {
  res.send("Request Received");
};

// just for testing purpose
export const identifyUserControllerGet = (req, res) => {
  res.send("receiving requests");
};
