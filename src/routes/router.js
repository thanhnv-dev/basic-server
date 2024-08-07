const express = require('express');
const usersRouter = require('./users.routes.js');
const authRouter = require('./auth.routes.js');
const mailRouter = require('./mail.routes.js');
const foodHubRouter = require('./foodHub.routes.js');

const apiRoute = express();

apiRoute.use('/user', usersRouter);
apiRoute.use('/auth', authRouter);
apiRoute.use('/mail', mailRouter);
apiRoute.use('/food-hub', foodHubRouter);

module.exports = apiRoute;
