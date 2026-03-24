import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  supplier_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier',
    required: true
  },
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0.01
  },
  stock_qty: {
    type: Number,
    default: 0,
    min: 0
  },
  reorder_level: {
    type: Number,
    required: true,
    min: 0
  },
  is_active: {
    type: Boolean,
    default: true
  },
  sku: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
    default: function() {
      return `SKU-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
    }
  },
  description: {
    type: String,
    trim: true
  },
  image: {
    type: String,
    trim: true
  },
  discount: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
    validate: {
      validator: function(value) {
        return value >= 0 && value <= 100;
      },
      message: 'Discount must be between 0 and 100'
    }
  },
  finalPrice: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true
});

// Pre-save hook to calculate finalPrice
productSchema.pre('save', function(next) {
  if (this.price && this.discount) {
    this.finalPrice = this.price - (this.price * this.discount / 100);
  } else if (this.price) {
    this.finalPrice = this.price;
  }
  next();
});



const Product = mongoose.model('Product', productSchema);

export default Product;