import app from "./app.js";
import connectDb from "./db/index.js";
import dotenv from "dotenv";
dotenv.config();
const PORT = process.env.PORT || 8080;
connectDb().then(()=>{
    app.listen(PORT,()=>{
        console.log("server is running on ",PORT);
    })
}).catch(
    (Err)=>console.log("there is some error white connecting: ",Err)
)