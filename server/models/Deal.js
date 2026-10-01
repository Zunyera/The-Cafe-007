const mongoose = require('mongoose');

const dealSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    items: [{ type: String, trim: true }],
    price: { type: Number, required: true, min: 0 },
    isAvailable: { type: Boolean, default: true },
    image: { type: String, default: '' },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Deal', dealSchema);