const mongoose = require('mongoose');

const {Schema} = mongoose;

const UserSchema = new Schema(
  {
    user_name: {type: String},
    email: {type: String},
    password: {type: String},
    date_of_birth: {type: String, default: null},
    img_url: {type: String, default: null},
    gender: {type: String, default: null},
    phone_number: {type: String, default: null},
    is_verified_email: {type: Boolean, default: false},
    address_default: {type: String, default: null},
  },
  {timestamps: true, versionKey: false},
);

const UserModel = mongoose.model('User', UserSchema, 'users');

module.exports = UserModel;
