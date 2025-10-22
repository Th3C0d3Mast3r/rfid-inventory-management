import mongoose from 'mongoose';

const inventorySchema=new mongoose.Schema({
    itemName:{
        type: String,
        required: true,
        unique: true,
    },

    itemIDs:[{
        itemId:{
            type: String,
            required: true
        },
        employee:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee',
            required: true
        },
        assignedAt:{
            type: Date,
            default: Date.now
        }
    }]
}, {timestamps:true});

export const Inventory=mongoose.model('Inventory', inventorySchema);
