const express = require("express");
const router = express.Router();

const userRoutes = require("./userRoutes");
const productRoutes = require("./productRoutes");
const storeRoutes = require("./storeRoutes");
const orderRoutes = require("./orderRoutes");
const supplierRoutes = require("./supplierRoutes");
const campaignRoutes = require("./campaignRoutes");

router.use("/users", userRoutes);
router.use("/products", productRoutes);
router.use("/stores", storeRoutes);
router.use("/orders", orderRoutes);
router.use("/supplier", supplierRoutes);
router.use("/campaign", campaignRoutes);

module.exports = router;