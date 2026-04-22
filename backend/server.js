// imports
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");

const app = express();

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected ✅"))
  .catch(err => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// middleware
app.use(cors({
  origin: process.env.CLIENT_URL || "http://127.0.0.1:5500", // Update for production
  credentials: true
}));
app.use(express.json());

// test route
app.get("/", (req, res) => {
  res.send("SAMAYRA backend running 🚀");
});

// routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);

// server start
app.listen(5000, () => {
  console.log("Server running on port 5000");
});