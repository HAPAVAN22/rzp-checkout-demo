require('dotenv').config();
const express = require('express');
const Razorpay = require('razorpay');
// const nanoid = require('nanoid').nanoid;
const crypto = require('crypto');

const router = express.Router();

router.post('/orders', async (req, res) => {
  const { amount } = req.body;
  if (!amount) {
    res.status(500).send({ message: 'Price is mandatory for order creation.' });
    return;
  }
  try {
    const instance = new Razorpay({
      key_id: process.env.KEY_ID,
      key_secret: process.env.KEY_SECRET,
    });

    const options = {
      amount: amount,
      currency: 'INR',
    };

    const order = await instance.orders.create(options);

    if (!order) return res.status(500).send('Some error occured');

    res.json(order);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post('/verify', async (req, res) => {
  try {
    const { orderCreationId, razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;

    const shasum = crypto.createHmac('sha256', process.env.KEY_SECRET);
    shasum.update(`${orderCreationId}|${razorpayPaymentId}`);
    const digest = shasum.digest('hex');

    if (digest !== razorpaySignature) return res.status(400).json({ msg: 'Transaction not legit!' });

    res.json({
      msg: 'success',
      orderId: razorpayOrderId,
      paymentId: razorpayPaymentId,
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;