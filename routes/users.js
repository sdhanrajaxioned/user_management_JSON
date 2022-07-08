const express = require('express');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator')
const {body, validationResult } = require('express-validator');
const { getUser, saveUser } = require('../utils/util-func');
const router = express.Router();

const app = express();

router.use(express.json());
router.use(bodyParser.urlencoded({ extended: true }));

// Read User
router.get('/', (_req, res) => {
  const users = getUser(); // gets existing users from databse
  res.status(200).send(users);
});

// Create User
router.post(
  '/add',
  (req, res) => {
    console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const existingUsers = getUser(); // get existing users from databse
    let existingUsersArr = Object.keys(existingUsers).map((key) => existingUsers[key]); // converting object to array
    const userData = req.body; // get new user data from post request

    //checking if the username already exists
    const findExist = existingUsersArr.find( user => user.username === userData.username )
    console.log(findExist)
    if (findExist) return res.status(409).send({error: true, msg: 'username already exist'})
    
    existingUsersArr.push(userData) //adding new user to users
    saveUser(existingUsersArr); //saving in database
    res.status(201).send({success: true, msg: 'User data added successfully'})
});

module.exports = router;