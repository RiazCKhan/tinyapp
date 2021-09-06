// ------ User & URL "Database" ------ \\
const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "123"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

const urlDatabase = {
  b6UTxQ: { longURL: "https://www.lighthouselabs.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
};

// ------ HELPER FUNCTIONS ------ \\

// Generate random alphanumeric characters
const randomGenerator = generateRandomString => {
  return Math.random().toString(16).substr(2, 6);
};

// URLs displayed for unique user
const urlsForUser = function(user_id) {
  const uniqueUserUrls = {};
  for (url in urlDatabase) {
    if (user_id === urlDatabase[url].userID) {
      uniqueUserUrls[url] = urlDatabase[url];
    }
  }
  return uniqueUserUrls;
};

const getUserByEmail = (email, users) => {
  for (let id in users) {
    if (users[id].email === email) {
      return users[id].id;
    }
  }
  return null;
};


module.exports = { urlDatabase, users, randomGenerator, urlsForUser, getUserByEmail };