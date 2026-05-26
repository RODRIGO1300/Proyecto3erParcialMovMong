const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    rating: {
      rate: { type: Number, required: true },
      count: { type: Number, required: true }
    },
    seller: { type: String, required: true },
    isLocal: { type: Boolean, required: true }
  },
  { collection: 'Products' }
);

module.exports = mongoose.model('Product', ProductSchema);
