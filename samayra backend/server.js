// imports
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected ✅"))
  .catch(err => console.log(err));

// middleware
app.use(cors());
app.use(express.json());

// models
const User = require("./models/User");        // fit data
const AuthUser = require("./models/AuthUser"); // login data

// test route
app.get("/", (req, res) => {
  res.send("SAMAYRA backend running 🚀");
});


// ================== AUTH SYSTEM ==================

// SIGNUP
app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await AuthUser.findOne({ email });

    if (existing) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    const user = new AuthUser({ name, email, password });
    await user.save();

    res.json({ message: "Account created successfully" });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


// LOGIN
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await AuthUser.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Account not found. Please sign up first."
      });
    }

    if (user.password !== password) {
      return res.status(400).json({
        message: "Incorrect password"
      });
    }

    res.json({
      message: "Login successful",
      user
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


// ================== SAVE FIT ==================

app.post("/saveFit", async (req, res) => {
  try {
    const { userId, name, email, fitType, confidence } = req.body;

    const userFit = new User({
      userId,
      name,
      email,
      fitType,
      confidence
    });

    await userFit.save();

    res.json({ message: "Fit saved successfully ✅", userFit });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ================== GET LAST FIT ==================

app.get("/getFit/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const fit = await User.findOne({ userId })
      .sort({ createdAt: -1 });

    res.json(fit);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// server start
app.listen(5000, () => {
  console.log("Server running on port 5000");
});