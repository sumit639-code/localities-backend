import express from "express";
import cookieparser from "cookie-parser";
import cors from "cors";
import { errorHandler } from "./middleware/errorHandler.middleware.js";

const app = express();
app.use(cookieparser());

const corsOptions = {
  origin: "http://localhost:3000", // Replace with your frontend origin
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"], // Specify which headers can be sent
  credentials: true, // Enable credentials (cookies, authorization headers, etc.)
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send("Hello from Localities!");
});

import userRouter from "./routes/user.routes.js";
import productRouter from "./routes/products.routes.js";
import reviewRoute from "./routes/review.routes.js";

app.use("/users", userRouter);
app.use("/products", productRouter);
app.use("/review", reviewRoute);

// Error handler middleware should be placed after all routes
app.use(errorHandler);

export default app;
