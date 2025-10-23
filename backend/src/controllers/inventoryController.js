import { Inventory } from "../models/inventory.mode.js";
import { Employee } from "../models/employee.model.js";
import mongoose from "mongoose";

export const addInventoryItem = async (req, res) => {
  const { itemName, itemId, emailId } = req.body;

  if (!itemName || !itemId || !emailId) {
    return res.status(400).json({ error: "itemName, itemId, and emailId are required" });
  }

  try {
    const employee = await Employee.findOne({ emailId }).select("_id");
    if (!employee) return res.status(404).json({ error: "Employee not found" });

    let inventory = await Inventory.findOne({ itemName });

    if (inventory) {
      // Add new RFID to existing item
      inventory.itemIDs.push({ itemId, employee: employee._id });
    } else {
      // Create new product
      inventory = new Inventory({
        itemName,
        itemIDs: [{ itemId, employee: employee._id }],
      });
    }

    await inventory.save();
    res.status(200).json({ message: "Item added successfully", inventory });
  } catch (err) {
    console.error("Error adding item:", err);
    res.status(500).json({ error: "Failed to add item" });
  }
};

// Fetch all items
export const getAllInventoryItems = async (req, res) => {
  try {
    const inventory = await Inventory.find().populate(
      "itemIDs.employee",
      "name emailId role"
    );
    res.status(200).json(inventory);
  } catch (err) {
    console.error("Error fetching inventory:", err);
    res.status(500).json({ error: "Failed to fetch inventory" });
    console.log(err);
  }
};

// Delete a single RFID
export const deleteInventoryItem = async (req, res) => {
  const { rfid } = req.params;

  try {
    const inventory = await Inventory.findOne({ "itemIDs.itemId": rfid });
    if (!inventory)
      return res.status(404).json({ error: "Item not found" });

    inventory.itemIDs = inventory.itemIDs.filter(
      (i) => i.itemId !== rfid
    );
    await inventory.save();

    res.status(200).json({ message: "Item deleted successfully" });
  } catch (err) {
    console.error("Error deleting inventory item:", err);
    res.status(500).json({ error: "Failed to delete inventory item" });
  }
};
