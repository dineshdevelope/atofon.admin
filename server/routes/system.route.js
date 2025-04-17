import express from "express";
import {
  createSystem,
  getAllSystems,
  getSystemById,
  updateSystem,
  deleteSystem,
} from "../controllers/system.controller.js";

const router = express.Router();

// System routes
router.post("/", createSystem);
router.get("/", getAllSystems);
router.get("/:id", getSystemById);
router.put("/:id", updateSystem);
router.delete("/:id", deleteSystem);

export default router;
