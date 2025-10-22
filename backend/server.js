import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import rfidRoutes from './routes/rfidRoutes.js';
import dotenv from 'dotenv';
import connectDB from './src/db/database.js';

dotenv.config();

connectDB();        // this will conenct the database
const app = express();
const PORT = process.env.PORT || 7500;

app.use(cors());
app.use(bodyParser.json());

app.use("/trial", (req, res)=>{
    res.send("Backend Running Successfully");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});