import mongoose from 'mongoose';

const purchaseSchema = new mongoose.Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  supplier_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier',
    required: true
  },
  qty: {
    type: Number,
    required: true,
    min: 1
  },
  status: {
    type: String,
    default: 'Pending',
    enum: ['Pending', 'Ordered', 'Received', 'Cancelled']
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const Purchase = mongoose.model('Purchase', purchaseSchema);

export default Purchase;