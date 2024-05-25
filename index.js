import express from "express";
import cors from "cors";
import userRoute from "./routes/user.route.js"
import emailRoute from "./routes/emailVerify.route.js"
import adminRoute from "./routes/admin.route.js"
import productRoutes from "./routes/product.route.js"
import themeRoutes from "./routes/theme.route.js"
import orderRoutes from "./routes/order.route.js"
import ticketRouter from "./routes/ticket.route.js";
import packagingRouter from "./routes/package.route.js"
import tuneRouter from "./routes/tune.route.js";
import layoutRouter from "./routes/layout.route.js"
import pricingRouter from "./routes/pricing.route.js"
import {connect} from "./connection/index.js"
import dotenv from "dotenv";
import otpRoute from "./routes/otp.route.js"
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
  

app.use("/",userRoute);
app.use("/",emailRoute);
app.use("/",otpRoute);
app.use("/",adminRoute);
app.use("/",productRoutes)
app.use("/",themeRoutes)
app.use("/",orderRoutes)
app.use("/",ticketRouter);
app.use("/",tuneRouter);
app.use("/",packagingRouter);
app.use("/",layoutRouter);
app.use("/",pricingRouter);
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
