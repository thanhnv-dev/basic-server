const MailService = require('../services/mail.service.js');

const sendMail = async (req, res) => {
  const {email} = req.body;
  if (!email) {
    console.log('| Received data is not correct!!!');
    console.log('====================================');
    return res.status(400).json({msg: 'email field is required'});
  }
  const sendResult = await MailService.send(email);

  return res.status(sendResult.status).json(sendResult.res);
};

module.exports = {
  sendMail,
};
