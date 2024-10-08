const DishModel = require('../models/dish.model.js');
const CategoryModel = require('../models/categories.model.js');
const RestaurantModel = require('../models/restaurant.model.js');

const categories = async () => {
  try {
    const data = await CategoryModel.find();
    return {
      status: 200,
      res: {msg: 'Get categories successfully!', results: data},
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
      res: {msg: 'Get restaurants successfully!', results: data},
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
    const dataDish = await DishModel.find({parent_id: id});
    const dataRestaurant = await RestaurantModel.findById(id);

    const dataRes = [];

    dataDish.forEach(item => {
      const itemObject = item.toObject();
      delete itemObject.parent_id;
      delete itemObject.description;
      delete itemObject.toppings;
      dataRes.push(itemObject);
    });

    return {
      status: 200,
      res: {
        msg: 'Get restaurant successfully!',
        results: {
          ...dataRestaurant.toObject(),
          dishs: dataRes,
        },
      },
    };
  } catch (err) {
    console.log(err);
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
      res: {msg: 'Get restaurant successfully!', results: data},
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
