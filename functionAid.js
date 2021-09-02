// Generate random alphanumeric characters
const randomGenerator = generateRandomString => {
  return Math.random().toString(16).substr(2, 6);
}

const getUserByEmail = (email) => {
  for (const id in users) {
    const user = users[id];
    if (user.email === email) {
      return user;
    }
  }
  return null;
};

module.exports = { randomGenerator, getUserByEmail }