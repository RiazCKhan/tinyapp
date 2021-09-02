const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

const cookieParser = require('cookie-parser');
app.use(cookieParser());

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

// Generate random alphanumeric characters
const randomGenerator = generateRandomString => {
  return Math.random().toString(16).substr(2, 6);
}

const users = {
  'user1RandomID': {
    id: randomGenerator(),
    email: 'user1@example.com',
    password: '123456'
  },
  'user2RandomID': {
    id: randomGenerator(),
    email: 'user2@example.com',
    password: 'strong2gether!'
  }
}

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};


app.get("/", (req, res) => {
  res.redirect("/urls")
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase, username: req.cookies["username"] }; // updated w/username
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const templateVars = { username: req.cookies["username"]}; // updated w/username
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  const templateVars = { shortURL, longURL, username: req.cookies["username"] }; // updated w/username
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  if (!longURL.includes('http://')) {
   let result;  
   result = 'http://' + longURL
   res.redirect(result)
 }
  if (longURL.includes('http://')) {
   res.redirect(longURL)
 }
  if (!longURL) {
     res.statusCode = 404;
     res.write("404 Page Not Found");
  } 
});

app.get("/register", (req, res) => {
  res.render("regLogin")  
});

// ---------------------------------- POST BELOW

app.post("/urls", (req, res) => {
  const shortURL = randomGenerator();
  let longURL = req.body.longURL
  // console.log(req.body);  // Log the POST request body to the console
  if (!longURL.includes('http://')) {
    longURL = 'http://' + longURL
  }
  urlDatabase[shortURL] = longURL; // object assignment
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
  const username = req.body.username;
  res.cookie('username', username);
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  res.clearCookie('username');
  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});