const { Router } = require('express');
const mailingRouter = Router();
const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: 'mlauraschmidt@gmail.com',
        pass: 'vfmhvkcrecfbhcrx'
    }
})

mailingRouter.get('/mail', async (req, res) => {
    let result = await transport.sendMail({
        from: 'PIEDRA LIBRE <mlauraschmidt@gmail.com>',
        to: 'cschmidtcba@gmail.com',
        subject: 'Mail de prueba',
        html: `
        <div>
            <h1>Esto es un mail de prueba.</h1>
            <img src="cid: imagen1"/>
        </div>`,
        attachments: [{
            filename: 'logo.png',
            path: './src/images/logo.png',
            cid: 'imagen1'
        }]
    })

    res.send({status: "success", result:"mail enviado"});
})

module.exports = mailingRouter;