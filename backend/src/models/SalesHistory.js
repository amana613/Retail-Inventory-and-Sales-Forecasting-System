import mongoose from 'mongoose';

const salesHistorySchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Product',
    },
    date: {
      type: Date,
      required: true,
    },
    quantity_sold: {
      type: Number,
      required: true,
      default: 0,
    },
    revenue: {
      type: Number,
      required: true,
      default: 0.0,
    },
  },
  { timestamps: true }
);

const SalesHistory = mongoose.model('SalesHistory', salesHistorySchema);
export default SalesHistory;
