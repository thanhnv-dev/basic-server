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
  password: validateStringRequired().min(6),
  email: emailVelidate(),
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
  user_id: validateStringRequired(),
});

export const updateInfomationValidateSchema = Joi.object({
  user_name: validateStringRequired().min(3),
  email: emailVelidate(),
  date_of_birth: validateString(),
  gender: validateString(),
  phone_number: validateString(),
});

export const createDeliveryAddressValidateSchema = Joi.object({
  full_name: validateStringRequired(),
  phone_number: validateStringRequired(),
  address: Joi.array().required(),
  is_default: Joi.boolean().required(),
});
export const updateDeliveryAddressValidateSchema = Joi.object({
  address_id: validateStringRequired(),
  full_name: validateStringRequired(),
  phone_number: validateStringRequired(),
  address: Joi.array().required(),
  is_default: Joi.boolean().required(),
});

export const readNotiValidateSchema = Joi.object({
  noti_id: validateStringRequired(),
});
export const deleteDeliveryAddressValidateSchema = Joi.object({
  address_id: validateStringRequired(),
});
export const notificationValidateSchema = Joi.object({
  offset: Joi.number().integer(),
  limit: Joi.number().integer(),
});

export const logValidateSchema = Joi.object({
  reason: validateString(),
  device: validateString(),
  version: validateString(),
  appId: validateString(),
});
