const mongoose = require('mongoose');

const {Schema} = mongoose;

const NotificationSchema = new Schema({
  user_id: {type: String},
  title: {type: String},
  description: {type: String},
  unread: {type: Boolean, default: true},
  type: {type: String},
  createdAt: {type: Date},
  updatedAt: {type: Date},
});

const NotificationModel = mongoose.model(
  'notificaion',
  NotificationSchema,
  'notificaions',
);

module.exports = NotificationModel;
