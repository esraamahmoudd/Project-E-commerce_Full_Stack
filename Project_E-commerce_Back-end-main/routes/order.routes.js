const express = require("express");
const verifyToken = require("../middlewares/verifyToken");
const allowedTo = require("../middlewares/allowedTo");
const orderController = require("../controllers/order.controller");

const router = express.Router();

// Admin routes (admin only)
router.get("/", verifyToken, allowedTo("admin"), orderController.getAllOrders);
router.patch("/:orderId/status", verifyToken, allowedTo("admin"), orderController.updateOrderStatus);
router.delete("/:orderId", verifyToken, allowedTo("admin"), orderController.deleteOrder);

// User routes (authenticated users)
router.post("/", verifyToken, orderController.createOrder);
router.get("/my-orders", verifyToken, orderController.getUsersOrders);
router.get("/:orderId", verifyToken, orderController.getOrderbyId);
router.delete("/:orderId/cancel", verifyToken, orderController.cancelOrder);

module.exports = router;
