import mongoose from 'mongoose';

const deliverySchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Order',
    },
    rider: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // role should be rider
    },
    status: {
      type: String,
      enum: ['assigned', 'picked_up', 'in_transit', 'delivered', 'failed'],
      default: 'assigned',
    },
    pickup_time: { type: Date },
    delivery_time: { type: Date },
    notes: { type: String },
  },
  { timestamps: true }
);

const Delivery = mongoose.model('Delivery', deliverySchema);
export default Delivery;
