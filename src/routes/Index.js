const express = require("express");
const router = express.Router();

const userRoutes = require("./userRoutes");
const productRoutes = require("./productRoutes");

router.use("/users", userRoutes);
router.use("/products", productRoutes);

module.exports = router;
