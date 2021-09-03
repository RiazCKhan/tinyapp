// Generate random alphanumeric characters
const randomGenerator = generateRandomString => {
  return Math.random().toString(36).substr(2, 6);
}

module.exports = { randomGenerator }