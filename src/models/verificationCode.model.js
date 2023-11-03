const mongoose = require('mongoose');

const {Schema} = mongoose;

const VerificationCodeSchema = new Schema(
  {
    code: {type: Number},
    email: {type: String},
  },
  {timestamps: true, versionKey: false},
);

const VerificationCodeModel = mongoose.model(
  'VerificationCode',
  VerificationCodeSchema,
  'verification_codes',
);

module.exports = VerificationCodeModel;
