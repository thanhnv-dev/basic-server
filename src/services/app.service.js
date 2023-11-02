const DishModel = require('../models/dish.model.js');
const CategoryModel = require('../models/categories.model.js');
const RestaurantModel = require('../models/restaurant.model.js');

const categories = async () => {
  try {
    const data = await CategoryModel.find();
    return {
      status: 200,
      res: {msg: 'Get categories successfully!', result: data},
    };
  } catch (err) {
    return {
      status: 400,
      res: {msg: 'Something went wrong!'},
    };
  }
};
const restaurents = async () => {
  try {
    const data = await RestaurantModel.find();
    return {
      status: 200,
      res: {msg: 'Get restaurants successfully!', result: data},
    };
  } catch (err) {
    return {
      status: 400,
      res: {msg: 'Something went wrong!'},
    };
  }
};

const restaurent = async req => {
  const {id} = req.query;
  try {
    const data = await DishModel.find({parent_id: id});
    return {
      status: 200,
      res: {msg: 'Get restaurant successfully!', result: data},
    };
  } catch (err) {
    return {
      status: 400,
      res: {msg: 'Something went wrong!'},
    };
  }
};
const dish = async req => {
  const {id} = req.query;
  try {
    const data = await DishModel.findById(id);
    return {
      status: 200,
      res: {msg: 'Get restaurant successfully!', result: data},
    };
  } catch (err) {
    return {
      status: 400,
      res: {msg: 'Something went wrong!'},
    };
  }
};

module.exports = {
  categories,
  restaurents,
  restaurent,
  dish,
};
