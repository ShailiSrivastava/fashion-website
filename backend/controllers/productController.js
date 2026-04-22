const Product = require("../models/Product");
const User = require("../models/User");
const fs = require('fs');
const path = require('path');

// Helper to resolve products whether they are local or in DB
const resolveProducts = async (productIds) => {
  const stringIds = productIds.map(id => id.toString());
  const localDataPath = path.join(__dirname, '..', 'local_products.json');
  
  if (fs.existsSync(localDataPath)) {
    const localData = JSON.parse(await fs.promises.readFile(localDataPath, 'utf8'));
    // Filter local products that match the saved IDs
    return localData.filter(p => stringIds.includes(p._id.toString()));
  }
  
  // Fallback to database
  return await Product.find({ _id: { $in: stringIds } });
};

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    // ALWAYS TRY LOCAL FIRST (As requested for zero-fetch performance)
    const localDataPath = path.join(__dirname, '..', 'local_products.json');
    if (fs.existsSync(localDataPath)) {
      console.log("Serving local 'Lock' collection.");
      const localData = JSON.parse(await fs.promises.readFile(localDataPath, 'utf8'));
      return res.json(localData);
    }

    // Attempt database fetch only as a backup
    const products = await Product.find({});
    if (products.length > 0) {
      return res.json(products);
    }
  } catch (error) {
    console.error("Fetch failed:", error.message);
    res.json([
      {
        _id: "fb1",
        name: "Linen Summer Blouse",
        category: "casual",
        price: 185,
        imagePath: "assets/44 Chic Paris Summer Outfits That Capture The Timeless Style Of The City of Lights.jpg"
      }
    ]);
  }
};

// @desc    Toggle product in Virtual Closet
// @route   POST /api/users/closet/:productId
// @access  Private
const toggleClosetItem = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const productId = req.params.productId;

    if (user) {
      const index = user.savedItems.findIndex(id => id.toString() === productId);
      if (index > -1) {
        // Remove item
        user.savedItems.splice(index, 1);
      } else {
        // Add item
        user.savedItems.push(productId);
      }
      
      const updatedUser = await user.save();
      const resolvedItems = await resolveProducts(updatedUser.savedItems);

      res.json({
        message: index > -1 ? "Removed from closet" : "Added to closet",
        savedItems: resolvedItems
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Get Virtual Closet
// @route   GET /api/users/closet
// @access  Private
const getCloset = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      const resolvedItems = await resolveProducts(user.savedItems);
      res.json(resolvedItems);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

module.exports = { getProducts, toggleClosetItem, getCloset };
