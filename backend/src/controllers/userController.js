import { Employee } from "../models/employee.model.js"; // your Employee model

// GET all users (excluding admins if needed)
export const getAllUsers = async (req, res) => {
  try {
    const users = await Employee.find({ role: { $ne: "ADMIN" } });
    res.status(200).json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};


// DELETE a user by ID
export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await Employee.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    await Employee.findByIdAndDelete(id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ error: "Failed to delete user" });
  }
};
