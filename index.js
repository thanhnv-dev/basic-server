const express = require('express');
const cors = require('cors');
const db = require('./src/configs/db.config.js');
const apiRoute = require('./src/routes/router.js');
const {PORT} = require('./src/constants/index.js');
const admin = require('firebase-admin');
const swaggerUi = require('swagger-ui-express');
// const fs = require('fs');
// const YAML = require('yaml');
const swaggerDocument = require('./api_docs.json');
const {SERVICE_ACCOUNT, STORAGE_BUCKET} = require('./src/constants/index.js');

const options = {
  customCss: '.swagger-ui .topbar { display: none }',
};

db.connect().then(() => {
  admin.initializeApp({
    credential: admin.credential.cert(SERVICE_ACCOUNT),
    storageBucket: STORAGE_BUCKET,
  });
  const app = express();

  app.use(cors());
  app.use(express.urlencoded({extended: true}));
  app.use(express.json());

  // const file = fs.readFileSync('./api_docs.yaml', 'utf8');
  // const swaggerDocument = YAML.parse(file);

  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, options),
  );
  app.use('/', apiRoute);

  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
  });
});
