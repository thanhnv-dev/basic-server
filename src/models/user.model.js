const mongoose = require('mongoose');

const {Schema} = mongoose;

const UserSchema = new Schema(
  {
    userName: {type: String},
    email: {type: String},
    password: {type: String},
    dateOfBirth: {type: String, default: null},
    gender: {type: String, default: null},
    phoneNumber: {type: String, default: null},
    isVerifiedEmail: {type: Boolean, default: false},
  },
  {timestamps: true, versionKey: false},
);

const UserModel = mongoose.model('User', UserSchema, 'users');

module.exports = UserModel;
