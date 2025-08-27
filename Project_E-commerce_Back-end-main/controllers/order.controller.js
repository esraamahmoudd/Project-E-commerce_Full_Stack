const Order = require("../models/order.model");
const Product = require("../models/product.model");
const User = require("../models/user.model");

const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, notes } = req.body;
    const userId = req.user.id;

    if (!items || items.length === 0) {
      return res
        .status(400)
        .json({ message: "Order must contain at least one item" });
    }

    if (
      !shippingAddress ||
      !shippingAddress.street ||
      !shippingAddress.city ||
      !shippingAddress.country ||
      !shippingAddress.phoneNumber
    ) {
      return res.status(400).json({
        message: "Complete shipping address is required",
      });
    }

    const orderItems = [];
    let itemsPrice = 0;

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      if (product.stock < item.quantity) {
        return res
          .status(400)
          .json({ message: `Only ${product.stock} left in stock` });
      }

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
      });

      itemsPrice += product.price * item.quantity;

      await Product.findByIdAndUpdate(product._id, {
        $inc: { stock: -item.quantity },
      });
    }
    const shippingCost = itemsPrice > 1000 ? 0 : 100; //free shipping for orders above 1000

    const order = new Order({
      userId,
      items: orderItems,
      itemsPrice,
      shippingCost,
      shippingAddress,
      notes,
    });

    await order.save();

    await order.populate("userId", "FirstName LastName email");
    await order.populate("items.product", "name image price");

    res.status(201).json({ message: "Order created successfully", order });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getOrderbyId = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate("userId", "FirstName LastName email")
      .populate("items.product", "name image price");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if user is owner OR admin
    if (req.user.role !== "admin" && order.userId._id.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to get the order" });
    }

    res.status(200).json({ order });
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getUsersOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.find({ userId }).populate(
      "items.product",
      "name image"
    );

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found" });
    }

    res.status(200).json({ orders });
  } catch (error) {
    console.error("Error fetching user's orders:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const orders = await Order.find()
      .populate("userId", "FirstName LastName email")
      .populate("items.product", "name image price");

    res.status(200).json({ orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (status === 'cancelled' && order.status !== 'cancelled') {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(
          item.product,
          { $inc: { stock: item.quantity } }
        );
      }
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    ).populate("userId", "FirstName LastName email")
     .populate("items.product", "name image price");

    res.status(200).json({
      message: "Order status updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (req.user.role !== "admin" && order.userId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to cancel this order" });
    }

    if (["shipped", "delivered"].includes(order.status)) {
      return res.status(400).json({
        message: "Cannot cancel an order that is already shipped or delivered",
      });
    }

    if (order.status === "cancelled") {
      return res.status(400).json({ message: "Order is already cancelled" });
    }

    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: item.quantity } }
      );
    }

    order.status = "cancelled";
    await order.save();

    res.status(200).json({
      message: "Order cancelled successfully",
      order,
    });
  } catch (error) {
    console.error("Error cancelling order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status !== 'cancelled') {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(
          item.product,
          { $inc: { stock: item.quantity } }
        );
      }
    }

    await Order.findByIdAndDelete(orderId);

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createOrder,
  getOrderbyId,
  getUsersOrders,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
  deleteOrder,
};
