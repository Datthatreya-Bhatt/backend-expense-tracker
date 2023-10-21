const Razorpay = require('razorpay');
require('dotenv').config();

const { RAZORP_KEY_ID, RAZORP_KEY_S } = process.env;

const rzp = new Razorpay({
  key_id: RAZORP_KEY_ID,
  key_secret: RAZORP_KEY_S
});


exports.createOrder = (amount) => {
  return new Promise((resolve, reject) => {
    rzp.orders.create(
      {
        amount: amount,
        currency: 'INR'
      },
      (err, order) => {
        if (err) {
          reject(err);
        } else {
          order.key = RAZORP_KEY_ID;
          resolve(order);
        }
      }
    );
  });
};
