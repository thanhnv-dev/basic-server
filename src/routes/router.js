const express = require('express');
const usersRouter = require('./users.routes.js');
const mailRouter = require('./mail.routes.js');
const dishRouter = require('./dish.routes.js');

const apiRoute = express();

apiRoute.use('/user', usersRouter);
apiRoute.use('/mail', mailRouter);
apiRoute.use('/dish', dishRouter);

module.exports = apiRoute;
