import express from "express";
import multer from "multer";
import { createProduct, deleteImageOfProduct, getProduct, addNewVarient, updateBasicDetails, uploadImageOfProduct, updateVarient, getAllProducts, updatePricingVarient } from "../controllers/product.controller.js";
import { adminVerify } from "../middleware/verifyAdmin.js";
const router = express.Router();



const upload = multer({
    storage: multer.memoryStorage()
});


// API to create a product :
router.post('/admin/createProduct',upload.array('photo',5),createProduct);

// API to get a product:
router.get("/admin/manage/:id",getProduct)

// API to update the basic details of the product:(send _id of the document as well)
router.post("/admin/manageProduct",upload.array('photo',5),updateBasicDetails)

// API to delete a image
router.post("/admin/manage/deleteImage",deleteImageOfProduct)

// API to upload a image to a product
router.post("/admin/manageProduct/uploadImage",upload.single('photo'),uploadImageOfProduct)

// API to manage the pricing of product and vairent
router.post("/admin/manageProduct/pricing",upload.single('photo'),addNewVarient);

// API to update the varient of product :
router.post("/admin/manageProduct/updatePricing",upload.single('photo'),updateVarient);

// API to update the pricing and vairents pricing (in use from 24th may 2024) :
router.post("/admin/manageProduct/updatePricingVarient",adminVerify,updatePricingVarient);


// API to get products on the frontend:
router.post("/admin/getProduct",adminVerify,getAllProducts);

export default router;