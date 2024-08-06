import express, { json } from "express";
import cookieparser from "cookie-parser";
import cors from "cors";

const app = express();
const corsoptions = {
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true, // Enable credentials
};
app.use(cors(corsoptions));
app.use(cookieparser);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));


app.get('/',(req,res)=>{
    res.send("getting onto the root page");
    
})



export default app;
