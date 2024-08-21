const mongoose = require('mongoose');

const {Schema} = mongoose;

const DeliveryAddressSchema = new Schema(
  {
    user_id: {type: String},
    full_name: {type: String},
    phone_number: {type: String},
    address: {type: Array},
  },
  {timestamps: true, versionKey: false},
);

const DeliveryAddressModel = mongoose.model(
  'deliveryaddress',
  DeliveryAddressSchema,
  'deliveryaddresss',
);

module.exports = DeliveryAddressModel;
