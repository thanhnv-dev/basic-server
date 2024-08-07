const express = require('express');
const cors = require('cors');
const db = require('./src/configs/db.config.js');
const apiRoute = require('./src/routes/router.js');
const {PORT} = require('./src/constants/index.js');
const admin = require('firebase-admin');
const {SERVICE_ACCOUNT, STORAGE_BUCKET} = require('./src/constants/index.js');

db.connect().then(() => {
  admin.initializeApp({
    credential: admin.credential.cert(SERVICE_ACCOUNT),
    storageBucket: STORAGE_BUCKET,
  });
  const app = express();

  app.use(cors());
  app.use(express.urlencoded({extended: true}));
  app.use(express.json());
  app.use('/', apiRoute);

  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
  });
});
