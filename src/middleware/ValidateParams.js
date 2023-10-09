const Log = require('../utils/log.js');

const validateParams = schema => (req, res, next) => {
  const {error, value} = schema.validate(req.body);

  if (error) {
    Log.request({
      req,
      body: `[Validate params] ${error.details[0].message}`,
      code: 400,
    });

    return res.status(400).json({msg: error.details[0].message});
  }

  req.validatedParams = value;
  next();
};

export default validateParams;
