const express = require('express');
const usersRouter = require('./users.routes.js');
const mailRouter = require('./mail.routes.js');

const apiRoute = express();

apiRoute.use('/user', usersRouter);
apiRoute.use('/mail', mailRouter);

module.exports = apiRoute;
