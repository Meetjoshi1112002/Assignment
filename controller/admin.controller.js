import Admin from "../models/admin.model.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { errorHandler } from "../utils/error.js";

export const verifyAdmin = async (req, res, next) => {
    try {
        const admin_id = req.adminId;
        const admin = await Admin.findOne({_id:admin_id});
        if(!admin)throw new Error("admin not found");
        res.status(200).json(admin);
    } catch (error) {
        console.error(error);
        next(errorHandler(500, "Issue in admin verfiy :", error));
    }
};

const generatePassword = async(phone, dob) => {
    // Extract first 5 digits of the phone number
    const phonePrefix = phone.substring(0, 5);
    
    // Extract year, month, and day components from DOB
    const year = dob.getFullYear().toString().slice(-2);
    const month = ("0" + (dob.getMonth() + 1)).slice(-2);
    const day = ("0" + dob.getDate()).slice(-2);
    
    // Concatenate phone prefix and date components to generate password
    const password = phonePrefix + year + month + day;
    console.log(password);
    return password;

    
};

export const createAdmin = async (req, res, next) => {
    try {
        const { name, email, phone, dob, role } = req.body;

        // Generate password using phone and dob
        const password = await generatePassword(phone, new Date(dob));

        // Create new admin instance
        const admin = new Admin({ name, email, phone, dob, role, password });

        // Save admin to database
        await admin.save();

        // Respond with the created admin details
        res.status(200).json(admin);
    } catch (error) {
        console.error(error);
        next(errorHandler(500, "Issue in admin controller:", error));
    }
};


export const adminLogin = async (req, res, next) => {
    try {
        console.log("Hi");
        const { email, password } = req.body;

        // Find admin by email
        const admin = await Admin.findOne({ email });

        if (!admin) {
            // If admin doesn't exist, return an error
            return res.status(404).json({ message: 'Admin not found' });
        }


        if (password !== admin.password) {
            // If passwords don't match, return an error
            return res.status(401).json({ message: 'Invalid password' });
        }

        // Generate JWT token with admin ID and role
        const token = jwt.sign({ adminId: admin._id, role: admin.role, name:admin.name,email:admin.email }, process.env.KEY, { expiresIn: '1d' });

        // Set token in a cookie in the response with expiry date of one day
        res.cookie('adminToken', token, { httpOnly: true, expires: new Date(Date.now() + 24 * 60 * 60 * 1000) });

        res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        console.error(error);
        next(errorHandler(500, "Error in admin login:", error));
    }
};
