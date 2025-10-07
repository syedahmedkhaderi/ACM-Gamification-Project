const ShopItem = require('../models/ShopItem');
const User = require('../models/User');
const Activity = require('../models/Activity');

exports.list = async (req, res) => {
  try {
    const items = await ShopItem.find({ isAvailable: true }).sort({ price: 1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.purchase = async (req, res) => {
  try {
    const { itemId } = req.params;
    const user = await User.findById(req.session.userId);
    const item = await ShopItem.findById(itemId);

    if (!item || !item.isAvailable) {
      return res.status(404).json({ error: 'Item not available' });
    }

    if (user.coins < item.price) {
      return res.status(400).json({ error: 'Insufficient coins' });
    }

    user.coins -= item.price;
    user.inventory.push({
      itemId: item._id.toString(),
      name: item.name,
      type: item.type,
      icon: item.icon,
      purchasedAt: new Date(),
      isUsed: false
    });

    await user.save();

    const activity = new Activity({
      userId: user._id,
      type: 'shop-purchase',
      title: 'Item Purchased!',
      icon: item.icon,
      coinsEarned: -item.price
    });
    await activity.save();

    res.json({ message: 'Purchase successful', user, item });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const item = new ShopItem(req.body);
    await item.save();
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const item = await ShopItem.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const item = await ShopItem.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
