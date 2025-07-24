const mongoose = require('mongoose');

const {Schema} = mongoose;

const CustomSchema = new Schema(
  {
    reason: {type: String, default: null},
    reasonList: [{type: String}],
    userId: {type: String},
    deviceId: {type: String},
    device: {type: String},
    version: {type: String},
    appId: {type: String},
    sessionId: {type: String},
    env: {type: String},
  },
  {timestamps: true, versionKey: false},
);

const CustomModel = mongoose.model('Custom', CustomSchema, 'customs');

module.exports = CustomModel;
