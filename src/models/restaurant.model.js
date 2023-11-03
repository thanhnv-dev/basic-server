const mongoose = require('mongoose');

const {Schema} = mongoose;

const RestaurantSchema = new Schema(
  {
    restaurant_name: {type: String},
    review_count: {type: Number},
    review_star: {type: Number},
    tags: {type: JSON},
    deliveryDescription: {type: Object},
    verify: {type: Boolean},
    background_image_url: {type: String},
    restaurant_image_url: {type: String},
  },
  {timestamps: true, versionKey: false},
);

const RestaurantModel = mongoose.model(
  'restaurant',
  RestaurantSchema,
  'restaurants',
);

module.exports = RestaurantModel;
