const stripe = require("stripe")(process.env.STRIPE);

export default async function handler(req, res) {
  const charges = await stripe.charges.list();
  const total = charges.data.reduce((acc, charge) => {
    if (charge.paid && !charge.refunded && !charge.disputed) {
      return acc + charge.amount;
    }
    return acc;
  }, 0);
  return res.status(200).json({ total: total / 100 });
}
