require('dotenv').config()
const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

function sendMail({ to, templateId, dynamicTemplateData = {} }) {
  const msg = {
    to: to, // Change to your recipient
    from: 'Bikr <bikrtop@gmail.com>', // Change to your verified sender
    subject: 'Your verification code',
    template_id: templateId, // 'd-cb98f7ce5ac248ee955410abd4383224',

    dynamic_template_data: {
      ...dynamicTemplateData,
    },
  }

  sgMail
    .send(msg)
    .then(() => {
      console.log('Email sent')
    })
    .catch((error) => {
      console.error(error)
    })
}

// sendMail()

module.exports = sendMail
