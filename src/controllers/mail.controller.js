const MailService = require('../services/mail.service.js');
const Log = require('../utils/log.js');

const sendVerificationCode = async (req, res) => {
  const {email} = req.body;

  const sendResult = await MailService.sendVerificationCode(email);

  Log.request({
    req: req,
    msg: sendResult?.msg,
    code: sendResult.status,
  });

  return res.status(sendResult.status).json(sendResult.res);
};

const verifyCode = async (req, res) => {
  const {code} = req.body;

  const verifyCodeResult = await MailService.verifyCodeService(code);

  Log.request({
    req: req,
    msg: verifyCodeResult?.res?.msg,
    code: verifyCodeResult.status,
  });

  return res.status(verifyCodeResult.status).json(verifyCodeResult.res);
};

module.exports = {
  sendVerificationCode,
  verifyCode,
};
