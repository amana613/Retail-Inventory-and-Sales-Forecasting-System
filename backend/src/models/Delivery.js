import mongoose from "mongoose";

const deliverySchema = new mongoose.Schema(
  {
    order_id: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true, unique: true },
    rider_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["processing", "dispatched", "delivered"],
      default: "processing"
    }
  },
  { timestamps: true }
);

const Delivery = mongoose.model("Delivery", deliverySchema);
export default Delivery;
