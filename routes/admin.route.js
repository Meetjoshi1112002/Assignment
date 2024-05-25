import express from "express";
import { adminLogin, createAdmin, verifyAdmin } from "../controllers/admin.controller.js";
import { authenticateAdmin } from "../middleware/admin.middleware.js";

const router = express.Router();

// API endpoint to request email verification
router.post("/admin/sign-up",authenticateAdmin,createAdmin);

// Route to handle email verification link clicked by the user
router.post("/admin/login",adminLogin );

router.get("/admin/verify",authenticateAdmin,verifyAdmin)

export default router;

/*
{
    "name": "shivansh",
    "email": "123@gmail.com",
    "password": "12345240522",
    "dob": "2024-05-21T22:07:01.319Z",
    "phone": "1234567890",
    "role": 1,
    "_id": "664d1b059d612e82eeab4200",
    "__v": 0
}
*/