import mongoose from "mongoose";

export const connect = ()=>{

    mongoose.connect("mongodb+srv://shivanshmitra53:VXGeMhzZDe6dMDf8@cluster0.q7cngrb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    .then(()=>{
        console.log("success")
    })
    .catch((err)=>{
        console.log("Failure : "+err)
    })
}