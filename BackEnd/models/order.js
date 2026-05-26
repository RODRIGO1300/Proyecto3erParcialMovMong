const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true },
    title: { type: String, required: true },
    category: { type: String, default: 'General' },
    image: { type: String, default: '' },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true }
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    status: { type: String, default: 'procesado' },
    paymentMethod: { type: String, default: 'tarjeta' },
    shippingAddress: { type: String, default: 'Entrega digital / mostrador' },
    total: { type: Number, required: true },
    items: { type: [OrderItemSchema], required: true }
  },
  { collection: 'Orders', timestamps: true }
);

module.exports = mongoose.model('Order', OrderSchema);
