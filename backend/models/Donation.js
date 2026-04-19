const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema(
  {
    donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null, // allows anonymous donations
    },
    donorName: {
      type: String,
      default: "Anonymous",
    },
    amount: {
      type: Number,
      required: [true, "Donation amount is required"],
      min: [1, "Amount must be at least 1"],
    },
    currency: {
      type: String,
      default: "INR",
    },
    paymentId: {
      type: String,
      default: null,
    },
    paymentMethod: {
      type: String,
      enum: ["mock", "phonepay", "razorpay", "upi"],
      default: "mock",
    },
    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "success", // mock payments always succeed
    },
    message: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Donation", donationSchema);