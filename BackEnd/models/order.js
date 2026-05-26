const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, required: true },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true }
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    status: { type: String, required: true },
    paymentMethod: { type: String, required: true },
    shippingAddress: { type: String, required: true },
    total: { type: Number, required: true },
    items: { type: [OrderItemSchema], required: true }
  },
  { collection: 'Orders', timestamps: true }
);

module.exports = mongoose.model('Order', OrderSchema);
