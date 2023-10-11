const generateRandomCode = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

const hasPassed2Minutes = lastUpdatedTime => {
  const lastUpdatedDate = new Date(lastUpdatedTime);
  const now = new Date();
  const differenceInSeconds = (now - lastUpdatedDate) / 1000;

  return differenceInSeconds >= 120;
};

module.exports = {
  generateRandomCode,
  hasPassed2Minutes,
};
