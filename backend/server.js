import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
// import rfidRoutes from './routes/rfidRoutes.js';
import dotenv from 'dotenv';
import connectDB from './src/db/database.js';
import {login, signup, logout} from './src/controllers/authController.js';
import userRoutes from "./src/routes/userRoutes.js";
import inventoryRoutes from "./src/routes/inventoryRoutes.js";

dotenv.config();

connectDB();        // this will conenct the database
const app = express();
const PORT = process.env.PORT || 7500;

app.use(cors());
app.use(bodyParser.json());

// app.use()

app.use("/trial", (req, res)=>{
    res.send("Backend Running Successfully");
});

app.post("/login", (req, res)=>{
    login(req, res);
});

app.post("/signup", (req, res)=>{
    signup(req, res);
});

app.post("/logout", (req, res)=>{
    logout(req, res);
});

// for the user routes
app.use("/api", userRoutes);

// for the inventory ka status and the other things
app.use("/api/inventory", inventoryRoutes);

app.get("/", (req, res)=>{
    res.send("API is working");
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});