require('custom-env').env('api')
const nodeMailer = require('nodemailer')

const MAIL_SETTINGS = {
  secure: false,
  port: 8000,
  host: 'gmail',
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
}

const transporter = nodeMailer.createTransport(MAIL_SETTINGS);

const sendmail = async (params) => {
    try {
        const send = await transporter.sendMail({
            from: MAIL_SETTINGS.auth.user,
            to: params.to,
            Subject: 'OTP',
            html: `
            <div><h1>hello ji</h1></div>
            <div><h1>your otp : ${params.otp}</h1></div>
            <div>OTP valid for only 1 minute</div>`
        })
        return send;
    } catch (err) {
        console.log(err);
    }
}

module.exports = sendmail;