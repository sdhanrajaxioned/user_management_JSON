const express = require('express');
const bodyParser = require('body-parser');
const { getUser, saveUser } = require('./utils/util-func');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const app = express();
const port = 3000;

app.use(express.json()); //parses json payload
app.use(bodyParser.urlencoded({ extended: true })); //can accept any type of data

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

// initialize cookie-parser to allow us access the cookies stored in the browser.
app.use(cookieParser());

//initialize express-sesssion to track logged in users
app.use(
  session({
    key: 'user_sid',
    secret: "12345ABCD!@#$%",
    resave: false,
    saveUninitialized: false,
    cookie: {
      path : '/',
      secure: false,
      expires: 600000
    },
  })
);

// This middleware will check if user's cookie is still saved in browser and user is not set, then automatically log the user out.
// This usually happens when you stop your express server after login, your cookie still remains saved in the browser.
// app.use((req, res, next) => {
//   if(req.cookies.user_sid && !req.session.user) {
//     res.clearCookie('user_sid');
//   }
//   next();
// });

// middleware function to check for logged-in users
const sessionChecker = (req, res, next) => {
  if (req.session.role =='admin' && req.cookies.user_sid) res.redirect("/users");
  if (req.session.role =='basic' && req.cookies.user_sid) res.redirect("/dashboard");
  next();
};

const getExisttingData = () => {
  const existingUsers = getUser(); // get existing users from databse
  return Object.keys(existingUsers).map((key) => existingUsers[key]); // converting object to array
}

app.get('/', sessionChecker, (_req, res) => { // route for home page
  res.redirect('/login');
});

//route for user login
app
  .route('/login')
  .get(sessionChecker, (req, res) => {
    res.status(200).send('welcome to login page');
  })
  .post(urlencodedParser, (req, res) => {
    let userId = req.body.id;
    let existingUsersArr = getExisttingData(); //get the existing userdata
    let findExistId = existingUsersArr.find( user => user.id === userId );
    //checking whether user exists
    if (findExistId) {
      req.session.role = findExistId.role;  
      console.log(req.session.role)
      if(req.session.role == 'admin') res.redirect('/users');
      else if(req.session.role == 'basic') res.redirect('/dashboard')
    } else {
      res.status(409).send({ error: true, msg: 'Please enter correct ID' })
    }
  });

app.get('/dashboard', (req, res) => { // route for user's dashboard
  if (req.session.role && req.cookies.user_sid) {
    res.status(200).send('Dashboard page');
  } else {
    res.redirect("/login");
  }
});

// route for user logout
app.get("/logout", (req, res) => {
  if (req.session.role && req.cookies.user_sid) {
    res.clearCookie("user_sid");
    res.redirect("/");
  } else {
    console.log(req.session.role)
    console.log(false)
    res.redirect("/login");
  }
});

app.use('/users', require('./routes/users')); // only admin can access this route

//server On
app.listen(port, console.log(`listening on ${port} ...`))

module.exports = sessionChecker;