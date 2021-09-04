const { urlDatabase, users } = require('./express_server')

// Generate random alphanumeric characters
const randomGenerator = generateRandomString => {
  return Math.random().toString(36).substr(2, 6);
}

const urlsForUser = function (user_id) {
  const urlsBelongingToUser = {};
  for (url in urlDatabase) {
    if (user_id === urlDatabase[url].userID) {
      urlsBelongingToUser[url] = urlDatabase[url];
    }
  }
  return urlsBelongingToUser;
}

module.exports = { randomGenerator, urlsForUser }