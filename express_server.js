const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
app.set("view engine", "ejs");

const bcrypt = require('bcrypt');
const saltRounds = 10;

const cookieSession = require('cookie-session')
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}))

const cookieParser = require('cookie-parser');
app.use(cookieParser());

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

const { randomGenerator } = require('./functionAid');

const urlsForUser = function (user_id) {
  const uniqueUserUrls = {};
  for (url in urlDatabase) {
    if (user_id === urlDatabase[url].userID) {
      uniqueUserUrls[url] = urlDatabase[url];
    }
  }
  return uniqueUserUrls;
}

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

app.get("/", (req, res) => {
  return res.redirect("/urls");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  const user = req.session['user_id'];
  const userEmail = users[req.session['user_id']]; 
  const urlsBelongingToUser = urlsForUser(user);
  const templateVars = { urls: urlsBelongingToUser, user: userEmail };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const user = users[req.session['user_id']]; 
  if (!user) {
    return res.redirect("/login");
  }
  const templateVars = { user };
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  const templateVars = { shortURL, longURL, user: users[req.session['user_id']] };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  if (!longURL) {
    return res.sendStatus(404);
  } else {
    return res.redirect(longURL['longURL']);
  }
});

app.get("/login", (req, res) => {
  const templateVars = { user: req.session["user_id"] }; 
  res.render("login", templateVars);
});

app.get("/register", (req, res) => {
  const templateVars = { user: req.session["user_id"] }; 
  res.render("register", templateVars);
});

// -------------------- POST BELOW -------------------- \\

app.post("/urls", (req, res) => {
  const userID = users[req.session['user_id']].id;
  const shortURL = randomGenerator();
  let longURL = req.body.longURL;
  if (!longURL.includes('https://')) {
    longURL = 'https://' + longURL;
  }
  urlDatabase[shortURL] = { longURL, userID };
  return res.redirect(`urls/${shortURL}`);
});

app.post("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  let longURL = req.body.longURL;
  if (!longURL.includes('https://')) {
    longURL = 'https://' + longURL;
  }
  const user = req.session['user_id']; 
  if (urlsForUser(user)) {
    urlDatabase[shortURL] = { longURL, userID: users[req.session['user_id']].id };
  }
  return res.redirect("/urls");
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  const user = req.session['user_id'];
  if (urlsForUser(user)) {
    delete urlDatabase[shortURL];
  }
  return res.redirect("/urls");
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send('Bad Request: email and password required');
  }
  for (const id in users) { // -------- REFACTOR HELPER FUNCTION REQUIRED -------- \\
    if (users[id].email === email) {
      if (bcrypt.compareSync(password, users[id].password)) {
        const userID = users[id].id;
        req.session['user_id'] = userID 
        return res.redirect("/urls");
      }
    }
  }
  return res.status(403).send('Bad Request: incorrect email or password');
});

app.post("/logout", (req, res) => {
  req.session = null;
  return res.redirect("/urls");
});

app.post("/register", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send('Bad Request: email and password required');
  }
  for (const id in users) { // -------- REFACTOR HELPER FUNCTION REQUIRED -------- \\
    if (users[id].email === email) {
      return res.status(400).send('Bad Request: Hmmmm... Try again');
    }
  }
  const hashedPassword = bcrypt.hashSync(password, saltRounds);
  const user = {
    id: randomID,
    email,
    password: hashedPassword
  };
  const randomID = randomGenerator();
  users[randomID] = user;
  req.session['user_id'] = randomID
  return res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

// -------------------WORKING AREA BELOW
// -------------------WORKING AREA ABOVE