const generateRandomCode = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

const hasPassed60Seconds = lastUpdatedTime => {
  const lastUpdatedDate = new Date(lastUpdatedTime);
  const now = new Date();
  const differenceInSeconds = (now - lastUpdatedDate) / 1000;

  return differenceInSeconds >= 60;
};

module.exports = {
  generateRandomCode,
  hasPassed60Seconds,
};
