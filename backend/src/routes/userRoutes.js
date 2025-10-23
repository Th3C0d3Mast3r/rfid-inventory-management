import express from "express";
import { getAllUsers, deleteUser } from "../controllers/userController.js";

const router = express.Router();

// GET all users (for admin)
router.get("/users", getAllUsers);

// DELETE a user by ID
router.delete("/users/:id", deleteUser);

export default router;
