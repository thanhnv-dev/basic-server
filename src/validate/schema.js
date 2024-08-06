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

const emailVelidate = () => {
  return validateString().email({
    minDomainSegments: 2,
    tlds: {allow: ['com', 'net', 'vn']},
  });
};

export const signUpValidateSchema = Joi.object({
  user_name: validateStringRequired().min(3),
  email: emailVelidate(),
  password: validateStringRequired().min(6),
  date_of_birth: validateString(),
  gender: validateString(),
  phone_number: validateString(),
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
  refresh_token: validateStringRequired(),
});

export const profileValidateSchema = Joi.object({
  id: validateStringRequired(),
});

export const customTokenValidateSchema = Joi.object({
  expires_in: Joi.string()
    .regex(/[smhd]/)
    .required(),
});

export const updateInfomationValidateSchema = Joi.object({
  user_name: validateStringRequired().min(3),
  email: emailVelidate(),
  date_of_birth: validateString(),
  gender: validateString(),
  phone_number: validateString(),
});
