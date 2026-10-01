const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    food: { type: mongoose.Schema.Types.ObjectId, ref: 'Food', default: null },
    name: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1, max: 99 },
    selectedSize: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, default: '' },
    flavour: { type: String, default: '' },
  },
  { _id: false },
);

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    branch: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', default: null },
    items: { type: [orderItemSchema], validate: value => Array.isArray(value) && value.length > 0 },
    subtotal: { type: Number, default: 0, min: 0 },
    deliveryFee: { type: Number, default: 0, min: 0 },
    totalAmount: { type: Number, required: true, min: 0 },
    phone: { type: String, required: true },
    deliveryAddress: { type: String, default: '' },
    paymentMethod: { type: String, default: 'Cash on Delivery' },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'],
      default: 'Pending',
    },
    notes: { type: String, default: '', maxlength: 500 },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Order', orderSchema);