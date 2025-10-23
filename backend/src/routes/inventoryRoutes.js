import express from "express";
import { addInventoryItem, getAllInventoryItems, deleteInventoryItem } from "../controllers/inventoryController.js";

const router = express.Router();

router.get("/items", getAllInventoryItems);
router.post("/items", addInventoryItem);
router.delete("/items/:rfid", deleteInventoryItem);

export default router;
