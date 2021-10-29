const Transaction = require('./transaction.model')
const User = require('../user/user.model')
const config = require('../../config')
const epayco = require('epayco-sdk-node')({
  apiKey: config.epaycoPublicKey,
  privateKey: config.epaycoPrivateKey,
  lang: 'ES',
  test: true,
})

const payService = async (req, res, next) => {
  try {
    let customer
    const data = req.body
    if (!res.locals.user.epaycoCustomerId) {
      const cardInfo = {
        'card[number]': data.cardNumber,
        'card[exp_year]': data.expYear,
        'card[exp_month]': data.expMonth,
        'card[cvc]': data.cvc,
      }
      const cardToken = await generateCardToken(cardInfo)

      const custInfo = {
        token_card: cardToken.id,
        name: res.locals.user.name,
        last_name: '',
        email: res.locals.user.email,
        default: true,
      }
      const customerToken = await generateCustomerToken(custInfo)

      customer = await User.findByIdAndUpdate(
        res.locals.user._id,
        {
          epaycoCustomerId: customerToken.data.customerId,
          epaycoCardId: cardToken.id,
        },
        { new: true },
      )
    } else {
      customer = res.locals.user
    }

    const bill = 'BI-'.concat(Math.floor(Math.random() * 100000))
    const paymentInfo = {
      token_card: customer.epaycoCardId,
      customer_id: customer.epaycoCustomerId,
      doc_type: data.docType,
      doc_number: data.docNumber,
      name: customer.name,
      last_name: '',
      email: customer.email,
      bill: bill,
      description: 'Test Payment',
      value: data.value,
      tax: data.value - data.value / 1.19,
      tax_base: data.value / 1.19,
      currency: 'COP',
      dues: data.dues,
      ip: '190.000.000.000',
      use_default_card_customer: true,
    }
    const payment = await generatePayment(paymentInfo)

    await Transaction.create({
      userId: res.locals.user._id,
      service: data.service,
      repairShopId: data.repairShopId,
      bill: bill,
      scheduleDate: data.scheduleDate,
      epaycoRef: payment.data.ref_payco,
      value: data.value,
    })

    res.status(200).json()
  } catch (e) {
    next(e)
  }
}

const generateCardToken = async (info) => {
  try {
    const cardToken = await epayco.token.create(info)
    return cardToken
  } catch (e) {
    return e
  }
}

const generateCustomerToken = async (info) => {
  try {
    const customerToken = await epayco.customers.create(info)
    return customerToken
  } catch (e) {
    return e
  }
}

const generatePayment = async (info) => {
  const payment = epayco.charge.create(info)
  return payment
}

module.exports = {
  payService,
}
