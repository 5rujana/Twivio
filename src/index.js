//require("dotenv").config(path: "./.env");
import dotenv from "dotenv";
 
import connectDB from "./db/index.js";

dotenv.config({
    path: "./.env"
})


connectDB();
//MongoDB connection error:  MongoServerError: bad auth : authentication failed
// why? because we are not passing the username and password to the connection string
// how to resolve this? we canresolve this by
// 1. passing the username and password to the connection string
// 2. or by creating a .env file and adding the username and password to it





















/*

import mongoose from "mongoose";
import { DB_NAME } from "./constants"; 

//first approach of handling db connection and server start
import express from "express";
const app = express();

(async()=>{
    try{
        await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`) 
        app.on("error",(error)=>{
            console.log("Error: ", error);
            throw error;
        })

        app.listen(process.env.PORT,()=>{
            console.log(`   App is listening on port ${process.env.PORT}`);
        })
    }catch(error){
        console.error("Error: ", error);
        throw err
    }
}) (); // IIFE immediately invoked function expression
//function is defined and executed immediately after it's creation */



