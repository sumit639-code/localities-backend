import mongoose, { Schema } from "mongoose";

const productSchema = new Schema(
  {
    buisness: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: Number,
      required: true,
    },
    productImages: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", productSchema);
