require('dotenv').config()

const accountSID = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const twilio = require('twilio');
const client = new twilio(accountSID, authToken);

/* Enviar mensaje a whatsApp */

client.messages
  .create({
    body: 'Hello from Node',
    from: '+12054489172', // From a valid Twilio number
    to: '+573155860681', // Text this number
  })
  .then((message) => console.log(`mensaje enviado ${message.sid}`))
  .catch((err)=>console.log(err))
