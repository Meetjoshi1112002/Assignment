import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        lowercase: true 
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    dob: {
        type: Date,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    role: {
        type: Number,
        min: 0,
        max: 7,
        required: true
    }
});


const Admin = mongoose.model('Admin', adminSchema);

export default Admin;
