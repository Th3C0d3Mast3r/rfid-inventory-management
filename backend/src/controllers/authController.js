import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {Employee}    from '../models/employee.model.js';

// signup controller
export const signup=async(req, res)=>{
    try{
        const {name, emailId, password, role}=req.body;
        const exists=await Employee.findOne({emailId});
        if(exists){
            return res.status(400).json({message: "EXISTS IN THE DB"});
        }

        const hashedPassword=await bcrypt.hash(password, 10);
        const newEmployee=new Employee({
            name,
            emailId,
            password: hashedPassword,
            role
        });
        await newEmployee.save();

        const token=jwt.sign(
            {
                id: newEmployee._id,
                emailId: newEmployee.emailId,
                role: newEmployee.role
            },
            process.env.JWT_SECRET,
            {expiresIn: '1d'}
        );

        res.status(201).json({
            message: "Signup successful",
            employee: {
                id: newEmployee._id,
                name: newEmployee.name,
                emailId: newEmployee.emailId,
                role: newEmployee.role,
            },
            token,
        });

    }
    catch(error){
        console.error("Error during signup:", error);
        res.status(500).json({message: "SERVER ERROR"});
    }
}

// login controller
export const login=async(req, res)=>{
    try{
        const {emailId, password}=req.body;
        const employee=await Employee.findOne({emailId});
        if(!employee){
            return res.status(400).json({message: "INVALID CREDENTIALS"});
        }
        const isPasswordValid=await bcrypt.compare(password, employee.password);
        if(!isPasswordValid){
            return res.status(400).json({message: "INVALID CREDENTIALS"});
        }
        const token=jwt.sign(
            {
                id: employee._id,
                emailId: employee.emailId,
                role: employee.role
            },
            process.env.JWT_SECRET,
            {expiresIn: '1d'}
        );
        res.status(200).json({
            message: "Login successful",
            employee: {
                id: employee._id,
                name: employee.name,
                emailId: employee.emailId,
                role: employee.role,
            },
            token,
        });
    }
    catch(err){
        console.error("SOME ERROR OCCURED");    
    }
};

// logout controller
export const logout=async (req, res)=>{
    try{
        const token=req.headers.authorization.split(" ")[1];
        // In a real-world application, you would store the token in a blacklist to invalidate it
        res.status(200).json({message: "Logout successful"});
    }
    catch(err){
        console.error("Error during logout:", err);
        res.status(500).json({message: "SERVER ERROR"});
    }
};
