
const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
app.set("view engine", "ejs");

const cookieParser = require('cookie-parser');
app.use(cookieParser());

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

const { randomGenerator } = require('./functionAid');

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
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
};

app.get("/", (req, res) => {
  res.send('Nada');
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase, user: users[req.cookies['user_id']] };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const user = users[req.cookies['user_id']];
  if (!user) {
    res.redirect('/login');
  }
  const templateVars = { user };
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  const templateVars = { shortURL, longURL, user: users[req.cookies['user_id']] };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  if (!longURL.includes('http://')) {
    let result;
    result = 'http://' + longURL;
    res.redirect(result);
  }
  if (longURL.includes('http://')) {
    res.redirect(longURL);
  }
  if (!longURL) {
    res.sendStatus(404);
  }
});

app.get("/login", (req, res) => {
  const templateVars = { user: req.cookies["user_id"] };
  res.render("login", templateVars);
});

app.get("/register", (req, res) => {
  const templateVars = { user: req.cookies["user_id"] };
  res.render("register", templateVars);
});

// ---------------------------------- POST BELOW

app.post("/urls", (req, res) => {
  const shortURL = randomGenerator();
  let longURL = req.body.longURL;
  if (!longURL.includes('http://')) {
    longURL = 'http://' + longURL;
  }
  urlDatabase[shortURL] = longURL;
  res.redirect(`urls/${shortURL}`);
});

app.post("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect("/urls");
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect("/urls");
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send('Bad Request: email and password required');
  }
  for (const id in users) {
    if (users[id].email === email) {
      if (users[id].password === password) {
        const userId = users[id].id;
        res.cookie('user_id', userId);
        res.redirect("/urls");
      } else {
        return res.status(403).send('Bad Request: incorrect email or password');
      }
    }
  }
});

app.post("/logout", (req, res) => {
  res.clearCookie('user_id');
  res.redirect("/urls");
});

app.post("/register", (req, res) => {
  const randomID = randomGenerator();
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send('Bad Request: invalid email or password');
  }
  for (const id in users) {
    if (users[id].email === email) {
      return res.status(400).send('Bad Request: user already exists');
    }
  }
  const user = {
    id: randomID,
    email,
    password
  };
  users[randomID] = user;
  res.cookie('user_id', randomID);
  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});