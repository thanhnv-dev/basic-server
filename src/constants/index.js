const dotenv = require('dotenv');

dotenv.config();

const URI_MONGODB = `mongodb+srv://${encodeURIComponent(
  process.env.MONGODB_ACCOUNT_NAME,
)}:${encodeURIComponent(process.env.MONGODB_ACCOUNT_PASSWORD)}@${
  process.env.MONGODB_CLUSTER
}/${process.env.MONGODB_DB_NAME}?retryWrites=true&w=majority`;

const PORT = process.env.PORT || 3000;

const TOKEN_EXPIRES_TIME = process.env.TOKEN_EXPIRES_TIME || '3h';
const REFRESH_TOKEN_EXPIRES_TIME =
  process.env.REFRESH_TOKEN_EXPIRES_TIME || '10 days';
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const ACCESS_REFRESH_TOKEN_SECRET = process.env.ACCESS_REFRESH_TOKEN_SECRET;

const BREVO_USER = process.env.BREVO_USER;
const BREVO_PASS = process.env.BREVO_PASS;

const MAILJS_SERVICE_ID_1 = process.env.MAILJS_SERVICE_ID_1;
const MAILJS_TEMPLATE_ID_1 = process.env.MAILJS_TEMPLATE_ID_1;
const MAILJS_PUBLIC_KEY_1 = process.env.MAILJS_PUBLIC_KEY_1;
const MAILJS_PRIVATE_KEY_1 = process.env.MAILJS_PRIVATE_KEY_1;

const MAILJS_SERVICE_ID_2 = process.env.MAILJS_SERVICE_ID_2;
const MAILJS_TEMPLATE_ID_2 = process.env.MAILJS_TEMPLATE_ID_2;
const MAILJS_PUBLIC_KEY_2 = process.env.MAILJS_PUBLIC_KEY_2;
const MAILJS_PRIVATE_KEY_2 = process.env.MAILJS_PRIVATE_KEY_2;

const STORAGE_BUCKET = process.env.STORAGE_BUCKET;
const SERVICE_ACCOUNT = {
  type: 'service_account',
  project_id: process.env.PROJECT_ID,
  private_key_id: process.env.PRIVATE_KEY_ID,
  private_key: process.env.PRIVATE_KEY,
  client_email: process.env.CLIENT_EMAIL,
  client_id: process.env.CLIENT_ID,
  auth_uri: process.env.AUTH_URI,
  client_x509_cert_url: process.env.CLIENT_X509_CERT_URL,
  token_uri: process.env.TOKEN_URI,
  auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
  universe_domain: process.env.UNIVERSE_DOMAIN,
};

module.exports = {
  URI_MONGODB,
  PORT,
  TOKEN_EXPIRES_TIME,
  REFRESH_TOKEN_EXPIRES_TIME,
  ACCESS_TOKEN_SECRET,
  ACCESS_REFRESH_TOKEN_SECRET,
  BREVO_USER,
  BREVO_PASS,
  MAILJS_SERVICE_ID_1,
  MAILJS_TEMPLATE_ID_1,
  MAILJS_PUBLIC_KEY_1,
  MAILJS_PRIVATE_KEY_1,
  MAILJS_SERVICE_ID_2,
  MAILJS_TEMPLATE_ID_2,
  MAILJS_PUBLIC_KEY_2,
  MAILJS_PRIVATE_KEY_2,
  STORAGE_BUCKET,
  SERVICE_ACCOUNT,
};
