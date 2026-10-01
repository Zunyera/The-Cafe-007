const mongoose = require('mongoose');

const sizeSchema = new mongoose.Schema(
  {
    name: { type: String, enum: ['Small', 'Medium', 'Large'], required: true },
    price: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

const foodSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    subCategory: { type: String, default: '' },
    basePrice: { type: Number, required: true, min: 0 },
    sizes: [sizeSchema],
    isAvailable: { type: Boolean, default: true },
    isPopular: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    image: { type: String, default: '' },
    description: { type: String, default: '' },
    flavours: [String],
  },
  { timestamps: true },
);

module.exports = mongoose.model('Food', foodSchema);