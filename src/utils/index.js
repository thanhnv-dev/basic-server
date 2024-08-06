const generateRandomCode = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

const hasPassed2Minutes = lastUpdatedTime => {
  const lastUpdatedDate = new Date(lastUpdatedTime);
  const now = new Date();
  const differenceInSeconds = (now - lastUpdatedDate) / 1000;

  return differenceInSeconds >= 120;
};
const getFileName = url => {
  const parts = url.split('/');
  const lastPart = parts[parts.length - 1];
  const queryParts = lastPart.split('?');
  return queryParts[0];
};
const getCurrentTimeUTC = () => {
  const currentDate = new Date();

  const hours = currentDate.getUTCHours();
  const minutes = currentDate.getUTCMinutes();
  const seconds = currentDate.getUTCSeconds();

  const formattedTime =
    (hours < 10 ? '0' : '') +
    hours +
    '_' +
    (minutes < 10 ? '0' : '') +
    minutes +
    '_' +
    (seconds < 10 ? '0' : '') +
    seconds;

  return formattedTime;
};

module.exports = {
  generateRandomCode,
  hasPassed2Minutes,
  getFileName,
  getCurrentTimeUTC,
};
