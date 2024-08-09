import express from "express";
import cookieparser from "cookie-parser";
import cors from "cors";

const app = express();
app.use(cookieparser());
const corsOptions = {
  origin: "http://localhost:3000", // Replace with your frontend origin
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true, // Enable credentials
};
app.use(cors(corsOptions));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send("Hello from Localities!");
});

import userRouter from "./routes/user.routes.js";
app.use("/users", userRouter);

export default app;
