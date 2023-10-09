const mongoose = require('mongoose');

const {Schema} = mongoose;

const VerificationCodeSchema = new Schema(
  {
    code: {count: Number, title: String},
    email: {count: Number, title: String},
  },
  {timestamps: true, versionKey: false},
);

const VerificationCodeSchemaModel = mongoose.model(
  'VerificationCode',
  VerificationCodeSchema,
  'verificationCodes',
);

module.exports = VerificationCodeSchemaModel;
