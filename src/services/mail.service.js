import {createTransport} from 'nodemailer';
const {BREVO_PASS, BREVO_USER} = require('../constants/index.js');

const generateRandomCode = () => {
  return Math.floor(100000 + Math.random() * 900000);
};
const send = async email => {
  const verificationCode = generateRandomCode();

  const transporter = createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    auth: {
      user: BREVO_USER,
      pass: BREVO_PASS,
    },
  });
  const mailOptions = {
    from: BREVO_USER,
    to: email,
    subject: `${verificationCode} is your verification code`,
    html: `<div> <h1>Verify Your Account</h1><p>Hello,</p> <p>Here is your verification code:</p><p><strong>Verification Code:</strong> ${verificationCode}</p><p>Please use this code to complete the account verification process. Please note that this code is only valid for a short period of time.</p><p>Thank you for joining us!</p><p>Best regards,</p><p>Thanh Nguyen</p></div>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return {
      status: 200,
      res: {msg: 'Email sent successfully!', code: verificationCode},
    };
  } catch (error) {
    return {status: 400, res: {msg: 'Somthing went wrong!'}};
  }
};

module.exports = {
  send,
};
