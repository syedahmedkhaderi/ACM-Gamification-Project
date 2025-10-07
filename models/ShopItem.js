const mongoose = require('mongoose');

const shopItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  price: {
    type: Number,
    required: true
  },
  icon: {
    type: String,
    default: '🎁'
  },
  type: {
    type: String,
    enum: ['theme', 'boost', 'cosmetic', 'other'],
    default: 'other'
  },
  effect: String,
  isAvailable: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('ShopItem', shopItemSchema);
