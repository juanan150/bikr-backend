const Transaction = require("./Transaction.model");
const config = require("../../config");
const epayco = require("epayco-sdk-node")({
  apiKey: config.epaycoPublicKey,
  privateKey: config.epaycoPrivateKey,
  lang: "ES",
  test: true,
});

const payService = async (req, res, next) => {
  try {
    const cardInfo = {
      "card[number]": req.body.cardNumber,
      "card[exp_year]": req.body.expYear,
      "card[exp_month]": req.body.expMonth,
      "card[cvc]": req.body.cvc,
    };
    const cardToken = await generateCardToken(cardInfo);
    console.log(cardToken);
    res.status(200).json({ cardToken });
  } catch (e) {
    next(e);
  }
};

const generateCardToken = async info => {
  try {
    const cardToken = await epayco.token.create(info);
    console.log(cardToken);
    return cardToken;
  } catch (e) {
    return e;
  }
};

module.exports = {
  payService,
};
