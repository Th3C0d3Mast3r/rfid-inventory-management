import mongoose from 'mongoose';

const employeeSchema=new mongoose.Schema({
    name:{
        type: String, 
        required: true
    },

    emailId:{
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: true,
    },
    lastOnline:{
        type: Date,
        default: Date.now
    },
    role:{
        type: String,
        enum: ["ADMIN", "STAFF"],
        default: "STAFF",
        required: true,
    }
}, {timestamps:true});

export const Employee=mongoose.model('Employee', employeeSchema);