import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Employee from '../models/employee.model.js';

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
