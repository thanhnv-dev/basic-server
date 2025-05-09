const express = require('express');
const fs = require('fs');
const path = require('path');
const usersRouter = require('./users.routes.js');
const authRouter = require('./auth.routes.js');
const mailRouter = require('./mail.routes.js');
const foodHubRouter = require('./foodHub.routes.js');
const notificationRouter = require('./notification.routes.js');

const apiRoute = express();

// Read apple-app-site-association file
const appleAppSiteAssociation = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, '../configs/apple-app-site-association'),
    'utf8',
  ),
);

const assetlinks = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../configs/assetlinks.json'), 'utf8'),
);

// iOS Universal Links
apiRoute.get('/.well-known/apple-app-site-association', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.json(appleAppSiteAssociation);
});

apiRoute.get('/apple-app-site-association', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.json(appleAppSiteAssociation);
});

// Android App Links
apiRoute.get('/.well-known/assetlinks.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.json(assetlinks);
});

apiRoute.get('/assetlinks.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.json(assetlinks);
});

apiRoute.get('/ton-connect', (req, res) => {
  res.send('<h1>Test Universal Link</h1>');
});
apiRoute.get('/', (req, res) => {
  res.send('<h1>Server is running!</h1>');
});

apiRoute.use('/user', usersRouter);
apiRoute.use('/auth', authRouter);
apiRoute.use('/mail', mailRouter);
apiRoute.use('/food-hub', foodHubRouter);
apiRoute.use('/notification', notificationRouter);

module.exports = apiRoute;
