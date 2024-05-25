import express from "express";
import cors from "cors";
import adminRoute from "./routes/admin.route.js"
import productRoutes from "./routes/product.route.js"
import {connect} from "./connection/index.js"
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
dotenv.config();

connect();
const app = express();
const port = 3000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173', // Allow requests from this origin
    credentials: true // Allow credentials (e.g., cookies) to be sent with requests
  }));
  

  app.use("/",adminRoute);
  app.use("/",productRoutes)
// error Handler
app.use((err,req,res,nex)=>{
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal server error";
    res.status(statusCode).json({
        success:false,
        message,
        statusCode
    })
})

app.listen(port,()=>{
    console.log(`I am at port ${port}`);
})
