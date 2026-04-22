const express = require("express");
const router = express.Router();
const { saveUserFit, getUserFit } = require("../controllers/userController");
const { toggleClosetItem, getCloset } = require("../controllers/productController");
const { protect } = require("../middleware/authMiddleware");

router.post("/fit", protect, saveUserFit);
router.get("/fit", protect, getUserFit);

// Virtual Closet
router.post("/closet/:productId", protect, toggleClosetItem);
router.get("/closet", protect, getCloset);

module.exports = router;
