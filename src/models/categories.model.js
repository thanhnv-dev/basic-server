const mongoose = require('mongoose');

const {Schema} = mongoose;

const CategorySchema = new Schema(
  {
    category_name: {type: String},
    image_url: {type: String},
  },
  {timestamps: true, versionKey: false},
);

const CategoryModel = mongoose.model(
  'category',
  CategorySchema,
  'categories',
);

module.exports = CategoryModel;
