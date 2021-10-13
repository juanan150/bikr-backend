const Transaction = require("./Transaction.model");
const User = require("../user/user.model");
const config = require("../../config");
const epayco = require("epayco-sdk-node")({
  apiKey: config.epaycoPublicKey,
  privateKey: config.epaycoPrivateKey,
  lang: "ES",
  test: true,
});

const payService = async (req, res, next) => {
  try {
    const data = req.body;
    const cardInfo = {
      "card[number]": data.cardNumber,
      "card[exp_year]": data.expYear,
      "card[exp_month]": data.expMonth,
      "card[cvc]": data.cvc,
    };
    const cardToken = await generateCardToken(cardInfo);

    const custInfo = {
      token_card: cardToken.id,
      name: res.locals.user.name,
      last_name: "",
      email: res.locals.user.email,
      default: true,
    };
    const customerToken = await generateCustomerToken(custInfo);
    console.log(res.locals.user._id);
    await User.findByIdAndUpdate(res.locals.user._id, {
      epaycoCustomerId: customerToken.data.customerId,
      epaycoCardId: cardToken.id,
    });

    res.status(200).json({ customerToken });
  } catch (e) {
    next(e);
  }
};

const generateCardToken = async info => {
  try {
    const cardToken = await epayco.token.create(info);
    return cardToken;
  } catch (e) {
    return e;
  }
};

const generateCustomerToken = async info => {
  try {
    const customerToken = await epayco.customers.create(info);
    return customerToken;
  } catch (e) {
    return e;
  }
};

module.exports = {
  payService,
};
