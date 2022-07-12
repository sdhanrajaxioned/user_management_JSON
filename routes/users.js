const express = require('express');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator')
const {body, validationResult } = require('express-validator');
const { getUser, saveUser } = require('../utils/util-func');
const router = express.Router();

router.use(express.json()); //parses json payload
router.use(bodyParser.urlencoded({ extended: true })); //can accept any type of data

// middleware function to check for logged-in users
const sessionChecker = (req, res, next) => {
  if (req.session.role =='admin' && req.cookies.user_sid) {
    res.redirect("/users");
  }
  else if (req.session.role =='basic' && req.cookies.user_sid) {
    res.redirect("/dashboard");
  }
  else {
    next();
  }
};

// Read User
router.get('/', (_req, res) => {
  const users = getUser(); // gets existing users from databse
  res.send(users);
});

// Create User
router.post(
  '/add',
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let existingUsersArr = getExisttingData(); //get the existing userdata
    const userData = req.body; // get new user data from post request

    //checking if the username already exists
    const findExist = existingUsersArr.find( user => user.username === userData.username )
    if (findExist) return res.status(409).send({error: true, msg: 'username already exist'})
    
    //checking if the id already exists
    const findExistId = existingUsersArr.find( user => user.id === userData.id )
    if (findExistId) return res.status(409).send({ error: true, msg: 'ID already exist' })
    
    existingUsersArr.push(userData) //adding new user to users
    saveUser(existingUsersArr); //saving in database
    res.status(201).send({success: true, msg: 'User data added successfully'})
});

// Update User
router.put(
  '/:username',
  (req, res) => {
  const userName = req.params.username;
  const userData = req.body;
  let existingUsersArr = getExisttingData(); //get the existing userdata

  //checking if the username already exists
  const findExistUser = existingUsersArr.find( user => user.username === userName )
  if (!findExistUser) return res.status(409).send({ error: true, msg: 'username does not exist' })

  //checking if the id already exists
  const findExistId = existingUsersArr.find( user => user.id === userData.id )
  if (findExistId) return res.status(409).send({ error: true, msg: 'Id already exist' })

  //filter the userdata
  const updateUser = existingUsersArr.filter( user => user.username !== userName );
  updateUser.push(userData);
  saveUser(updateUser);
  res.status(200).send({ success: true, msg: 'User data updated successfully' });
});

//Delete User
router.delete('/:id',
(req, res) => {
  const userName = req.params.username
  let existingUsersArr = getExisttingData(); //get the existing userdata

  //checking if the username already exists
  const findExistUser = existingUsersArr.find( user => user.username === userName )
  if (!findExistUser) return res.status(409).send({ error: true, msg: 'username does not exist' })

  //filter the userdata to remove it
  const filterUser = existingUsersArr.filter( user => user.username !== userName )
  if ( existingUsersArr.length === filterUser.length ) return res.status(409).send({error: true, msg: 'username does not exist'})
  
  //save the filtered data
  saveUser(filterUser)
  res.send({success: true, msg: 'User removed successfully'})
});

const getExisttingData = () => {
  const existingUsers = getUser(); // get existing users from databse
  return Object.keys(existingUsers).map((key) => existingUsers[key]); // converting object to array
}

module.exports = router;
module.exports.existingUsers = getExisttingData;