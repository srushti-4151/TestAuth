import mongoose, { mongo, Schema } from "mongoose";

const dishSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Dish name is required"],
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
    },
    imageUrl: {
      type: String,
      default: "",
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Only chefs
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Dish = mongoose.model("Dish", dishSchema);
