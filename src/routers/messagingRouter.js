const { Router } = require('express');
const messagingRouter = Router();
const twilio = require('twilio');
const configFn = require('../../utils/config');
const settings = configFn();

const account = settings.twilio_account;
const auth_token = settings.twilio_auth_token;
const phone_number = settings.twilio_phone_number;

const client = twilio(account, auth_token);

messagingRouter.get('/sms', async (req, res) => {
    let result = await client.messages.create({
        body: 'Esto es un mensaje de prueba',
        from: phone_number,
        to: '+543513139187'
    })

    res.send({status: "success", result:"mensaje enviado"});
})

module.exports = messagingRouter;