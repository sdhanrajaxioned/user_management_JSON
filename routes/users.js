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
    let username =req.body.username;

    //checking if the username already exists
    const findExist = existUsers.find( user => user.username === userData.username )
    if (findExist) return res.status(409).send({error: true, msg: 'username already exist'})
    
    //checking if the id already exists
    const findExistId = existingUsersArr.find( user => user.id === userData.id )
    if (findExistId) return res.status(409).send({ error: true, msg: 'username already exist' })
    
    existingUsersArr.push(userData) //adding new user to users
    saveUser(existingUsersArr); //saving in database
    res.status(201).send({success: true, msg: 'User data added successfully'})
});

router.put('/update/:username',(req, res) => {
  const userName = req.params.username;
  const userData = req.body;
  const existingUsers = getUser(); // get existing users from databse
  let existingUsersArr = Object.keys(existingUsers).map((key) => existingUsers[key]); // converting object to array

  //checking if the username already exists
  const findExistUser = existingUsers.find( user => user.username === userName )
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

module.exports = router;