const {createTransport} = require('nodemailer');
const emailjs = require('@emailjs/nodejs');
const {generateRandomCode, hasPassed2Minutes} = require('../utils/index.js');

const {
  BREVO_PASS,
  BREVO_USER,
  MAILJS_SERVICE_ID_1,
  MAILJS_TEMPLATE_ID_1,
  MAILJS_PUBLIC_KEY_1,
  MAILJS_PRIVATE_KEY_1,
  MAILJS_PUBLIC_KEY_2,
  MAILJS_PRIVATE_KEY_2,
  MAILJS_SERVICE_ID_2,
  MAILJS_TEMPLATE_ID_2,
} = require('../constants/index.js');
const VerificationCodeModel = require('../models/verificationCode.model.js');
const UserModel = require('../models/user.model.js');

const sendByBrevoService = async (verificationCode, email) => {
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
    html: `<div> <h1>Verify Your Account</h1><p>Hello,</p> <p>Here is your verification code:</p><p><strong>Verification Code:</strong> ${verificationCode}</p><p>Please use this code to complete the account verification process. Please note that this code is only valid for a short period of time.</p><p>Thank you for joining us!</p><p>Best regards</p></div>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return {
      status: true,
      msg: `Send by Brevo Service successfully!`,
    };
  } catch (error) {
    return {
      status: false,
      msg: `Send by Brevo Service failed!`,
    };
  }
};

const sendByEmailJSService = async (
  count,
  publicKey,
  privateKey,
  serviceId,
  templateId,
  verificationCode,
  email,
) => {
  emailjs.init({
    publicKey: publicKey,
    privateKey: privateKey,
  });

  const templateParams = {
    verificationCode: verificationCode,
    to: email,
  };

  try {
    await emailjs.send(serviceId, templateId, templateParams);

    return {
      status: true,
      msg: `Send by EmailJS Service ${count} successfully!`,
    };
  } catch (error) {
    return {
      status: false,
      msg: `Send by EmailJS Service ${count} failed!`,
    };
  }
};

const sendEmail = async (verificationCode, email) => {
  const sendByEmailJSService_1 = await sendByEmailJSService(
    1,
    MAILJS_PUBLIC_KEY_1,
    MAILJS_PRIVATE_KEY_1,
    MAILJS_SERVICE_ID_1,
    MAILJS_TEMPLATE_ID_1,
    verificationCode,
    email,
  );

  if (sendByEmailJSService_1.status) {
    return {status: true, msg: sendByEmailJSService_1.msg};
  } else {
    const sendByEmailJSService_2 = await sendByEmailJSService(
      2,
      MAILJS_PUBLIC_KEY_2,
      MAILJS_PRIVATE_KEY_2,
      MAILJS_SERVICE_ID_2,
      MAILJS_TEMPLATE_ID_2,
      verificationCode,
      email,
    );

    if (sendByEmailJSService_2.status) {
      return {status: true, msg: sendByEmailJSService_2.msg};
    } else {
      sendByBrevoService(verificationCode, email);
    }
  }
};

const checkDataAndUpdateVerificationCode = async (email, verificationCode) => {
  const findMail = await VerificationCodeModel.findOne({email});

  if (findMail) {
    const updateVerificationCodeResult = await VerificationCodeModel.updateOne(
      {email},
      {code: verificationCode},
    );
    if (updateVerificationCodeResult.acknowledged) {
      return true;
    } else {
      return false;
    }
  } else {
    const newVerificationCodeData = new VerificationCodeModel({
      email,
      code: verificationCode,
    });
    const newData = await newVerificationCodeData.save();
    if (newData) {
      return true;
    } else {
      return false;
    }
  }
};

const sendVerificationCode = async email => {
  const findUserByEmail = await UserModel.findOne({
    email: email?.toLowerCase(),
  });
  if (findUserByEmail) {
    if (findUserByEmail.is_verified_email) {
      return {status: 400, res: {msg: 'This email has been verified!'}};
    } else {
      const verificationCode = generateRandomCode();

      const checkDataResutl = await checkDataAndUpdateVerificationCode(
        email,
        verificationCode,
      );

      if (checkDataResutl) {
        const sendResult = await sendEmail(verificationCode, email);

        if (sendResult.status) {
          return {
            status: 200,
            res: {msg: 'Email sent successfully!'},
            msg: sendResult.msg,
          };
        }
      }
      return {status: 400, res: {msg: 'Somthing went wrong!'}};
    }
  } else {
    return {
      status: 400,
      res: {msg: 'This email is not yet associated with a user.'},
    };
  }
};

const verifyCodeService = async code => {
  const findCodeResult = await VerificationCodeModel.findOne({code});
  
  if (findCodeResult) {
    const email = findCodeResult?.email;
    const lastUpdatedTime = findCodeResult.updatedAt;
    const codeDataBase = findCodeResult.code;
    const hasPassed = hasPassed2Minutes(lastUpdatedTime);
    if (!hasPassed && code == codeDataBase) {
      const findUserByEmail = await UserModel.findOne({
        email: email?.toLowerCase(),
      });

      if (findUserByEmail) {
        const updateUserResult = await UserModel.updateOne(
          {email},
          {is_verified_email: true},
        );

        if (!updateUserResult.acknowledged) {
          return {
            status: 400,
            res: {msg: 'Something went wrong!'},
          };
        }
      }
      return {
        status: 200,
        res: {msg: 'Verified successfully!'},
      };
    }
  }
  return {
    status: 400,
    res: {msg: 'The verification code is incorrect or has expired!'},
  };
};

module.exports = {
  sendVerificationCode,
  verifyCodeService,
};
