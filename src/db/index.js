import mongoose from 'mongoose';
import express from 'express';
import {DB_NAME} from '../constants.js';
const connectDb =async ()=>{
    try {
        const connect_dbc = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
        console.log(connect_dbc);
        
    } catch (error) {
        console.log("there is some error is connecting to the db: ", error);
        
    }
}

export default connectDb;