import mongoose from "mongoose";

const salesHistorySchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    quantity_sold: { type: Number, required: true, min: 0 },
    revenue: { type: Number, required: true, min: 0 }
  },
  { timestamps: true }
);

const SalesHistory = mongoose.model("SalesHistory", salesHistorySchema);
export default SalesHistory;
