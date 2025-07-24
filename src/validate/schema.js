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

const signUpValidateSchema = Joi.object({
  user_name: validateStringRequired().min(3),
  password: validateStringRequired().min(6),
  email: emailVelidate(),
  date_of_birth: validateString(),
  gender: validateString(),
  phone_number: validateString(),
});

const signInValidateSchema = Joi.object({
  email: emailVelidate(),
  password: validateStringRequired().min(6),
});

const sendVerificationCodeValidateSchema = Joi.object({
  email: emailVelidate(),
});

const verifyCodeSchema = Joi.object({
  code: validateNumber(),
});

const refreshTokenValidateSchema = Joi.object({
  refresh_token: validateStringRequired(),
});

const profileValidateSchema = Joi.object({
  id: validateStringRequired(),
});

const customTokenValidateSchema = Joi.object({
  expires_in: Joi.string()
    .regex(/[smhd]/)
    .required(),
  user_id: validateStringRequired(),
});

const updateInfomationValidateSchema = Joi.object({
  user_name: validateStringRequired().min(3),
  email: emailVelidate(),
  date_of_birth: validateString(),
  gender: validateString(),
  phone_number: validateString(),
});

const createDeliveryAddressValidateSchema = Joi.object({
  full_name: validateStringRequired(),
  phone_number: validateStringRequired(),
  address: Joi.array().required(),
  is_default: Joi.boolean().required(),
});
const updateDeliveryAddressValidateSchema = Joi.object({
  address_id: validateStringRequired(),
  full_name: validateStringRequired(),
  phone_number: validateStringRequired(),
  address: Joi.array().required(),
  is_default: Joi.boolean().required(),
});

const readNotiValidateSchema = Joi.object({
  noti_id: validateStringRequired(),
});
const deleteDeliveryAddressValidateSchema = Joi.object({
  address_id: validateStringRequired(),
});
const notificationValidateSchema = Joi.object({
  offset: Joi.number().integer(),
  limit: Joi.number().integer(),
});

const logValidateSchema = Joi.object({
  reasonList: Joi.array().items(Joi.string()),
  userId: validateString(),
  deviceId: validateString(),
  sessionId: validateString(),
  env: validateString(),
  reason: Joi.string().allow(null),
  device: validateString(),
  version: validateString(),
  appId: validateString(),
});

module.exports = {
  signUpValidateSchema,
  signInValidateSchema,
  sendVerificationCodeValidateSchema,
  verifyCodeSchema,
  refreshTokenValidateSchema,
  profileValidateSchema,
  customTokenValidateSchema,
  updateInfomationValidateSchema,
  createDeliveryAddressValidateSchema,
  updateDeliveryAddressValidateSchema,
  readNotiValidateSchema,
  deleteDeliveryAddressValidateSchema,
  notificationValidateSchema,
  logValidateSchema,
};
