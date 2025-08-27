const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "products",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
});

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [orderItemSchema],
    itemsPrice: {
      type: Number,
      min: 0,
    },
    shippingCost: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalPrice: {
      type: Number,
      min: 0,
    },
    shippingAddress: {
      street: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
      phoneNumber: {
        type: String,
        required: true,
      },
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    notes: {
      type: String,
      maxlength: 500,
      default: "",
    },
  },
  { timestamps: true }
);

// Auto-calculate prices before saving
orderSchema.pre("save", function (next) {
  this.itemsPrice = this.items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  this.totalPrice = this.itemsPrice + (this.shippingCost || 0);

  next();
});

// Unique orderNumber
orderSchema.pre("save", function (next) {
  if (this.isNew) {
    this.orderNumber = `ORD-${Date.now()}`;
  }
  next();
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
