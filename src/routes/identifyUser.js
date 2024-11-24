import { Router } from "express";
import {
  identifyUserController,
  identifyUserControllerGet,
} from "../controllers/indentifyUserController.js";

const router = Router();

router.post("/", identifyUserController);
router.get("/", identifyUserControllerGet); // just for testing purpose

export default router;
