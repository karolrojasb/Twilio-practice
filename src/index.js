require('dotenv').config()

//
const accountSID = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const twilio = require('twilio');
const client = new twilio(accountSID, authToken);

// 
const express = require('express')
const PORT = process.env.PORT || 5000 

//
const email = require('./email')
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)


const APP = express()
APP.use(express.json())
APP.use(express.urlencoded({extended:false}))

APP.listen(PORT, ()=>{
  console.log(`Accede al sitio web dando click aquí: http://localhost:${PORT}`)
})

/* Enviar mensaje a whatsApp */

client.messages
  .create({
    body: 'Hello from Node',
    from: '+12054489172', // From a valid Twilio number
    to: '+573155860681', // Text this number
  })
  .then((message) => console.log(`mensaje enviado ${message.sid}`))
  .catch((err)=>console.log(err))

APP.get('/',(req, res, next) => {
  res.json({message: 'Success'})
})

/* http://localhost:5000/api/email/confirmacion */
APP.post('/api/email/confirmacion', async(req, res, next)=>{
  try {
    res.json(await email.sendOrder(req.body))
  } catch(err) {
    next(err)
  }
})

APP.use((err, req, res, next)=>{
  const statusCode = err.statusCode || 500
  console.error(err.message, err.stack)
  res.status(statusCode).json({'message': err.message})
  return
})

function getMessage(){
  const body = 'mensaje enviado el 11/04/2022 07:01:00 a.m.'
  return {
    to: 'karol.rojasb@gmail.com',
    from: 'karol.rojasb@autonoma.edu.co',
    subject: 'Prueba sendgrid Software II',
    text: body,
    html: `
    <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE-edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
      </head>
      <body>
        <div class="container section">
          <label><strong>Paisaje</strong></label>
          <img src="../public/img/RW8461.jpg" alt="" width="400px">
        </div>
      </body>
      </html>`
  }
}

async function sendEmail(){
  try {
    await sgMail.send(getMessage(emailParams))
    console.log('El correo ha sido enviado')
  } catch (err) {
    const message = 'No se pudo enviar el mensaje'
    console.error(message)
    console.error(err)
    if (err.response) console.error(err.response.body)
  }
}

(async()=>{
  console.log('Enviando correo electrónico')
  await sendEmail
})
