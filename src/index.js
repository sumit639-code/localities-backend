import app from "./app.js";
import connectDb from "./db/index.js";
import dotenv from 'dotenv';
dotenv.config();

connectDb().then(
    app.listen(process.env.PORT,()=>{
        console.log("server is running on: ", process.env.PORT);
    })
).catch(
    (Err)=>console.log(Err)
)