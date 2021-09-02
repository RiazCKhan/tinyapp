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
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.redirect("/register")
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase, user: users[req.cookies['user_id']] };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const templateVars = { user: users[req.cookies['user_id']] };
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
  const templateVars = { user: req.cookies["user_id"] };
  res.render("register", templateVars)
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
  res.clearCookie('user_id');
  res.redirect("/urls");
});

app.post("/register", (req, res) => {
  const randomID = randomGenerator() 
  const { email, password } = req.body
  const user = { 
    id: randomID,
    email,
    password
  };
  users[randomID] = user
  res.cookie('user_id', randomID)
  res.redirect("/urls")
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});