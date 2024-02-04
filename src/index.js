import connectDB from "./db/index.js";
import dotenv from "dotenv";
import {app} from './app.js'
dotenv.config({
    path: "./env"
});





connectDB().then(()=>{
    console.log("Connected to the database successfully !!!");
    app.on("erroe",(error)=>{
        console.log("Error starting the server !!!",error);
    })
    app.listen(process.env.PORT || 8000,()=>{
        console.log("Server is running on port 8000",process.env.PORT);
    });
}).catch((err)=>{
    console.log("Error connecting to the database !!!",err);
});