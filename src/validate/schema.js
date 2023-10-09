const Joi = require('joi');

function validateStringRequired() {
  return Joi.string().required();
}
function validateString() {
  return Joi.string();
}

function validateNumber() {
  return Joi.number().integer().required();
}

function validateBoolean() {
  return Joi.boolean().required();
}

const emailVelidate = () => {
  return validateString().email({
    minDomainSegments: 2,
    tlds: {allow: ['com', 'net', 'vn']},
  });
};

export const signUpValidateSchema = Joi.object({
  userName: validateStringRequired().min(3),
  email: emailVelidate(),
  password: validateStringRequired().min(6),
  dateOfBirth: validateString(),
  gender: validateString(),
  phoneNumber: validateString(),
});

export const signInValidateSchema = Joi.object({
  email: emailVelidate(),
  password: validateStringRequired().min(6),
});

export const sendVerificationCodeValidateSchema = Joi.object({
  email: emailVelidate(),
});

export const verifyCodeSchema = Joi.object({
  code: validateNumber(),
});

export const refreshTokenValidateSchema = Joi.object({
  refreshToken: validateStringRequired(),
});
