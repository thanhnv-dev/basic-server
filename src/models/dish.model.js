const mongoose = require('mongoose');

const {Schema} = mongoose;

const DishSchema = new Schema(
  {
    dish_name: {type: String},
    parent_id: {type: String},
    image_url: {type: String},
    description: {type: String},
    price: {type: Number},
    review_count: {type: Number},
    review_star: {type: Number},
    toppings: {type: Array},
  },
  {timestamps: true, versionKey: false},
);

const DishModel = mongoose.model('dish', DishSchema, 'dishs');

module.exports = DishModel;
