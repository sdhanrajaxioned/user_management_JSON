const express = require('express');
const { existingUsers } = require('../routes/users');
const { getUser } = require('../utils/util-func');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();
app.use(bodyParser.urlencoded({ extended: true })); //can accept any type of data

const ROLE = {
  ADMIN: 'admin',
  BASIC: 'basic'
};

// let users = existingUsers();
// const authUser = (req, res, next) => {
//   const userId = req.body.id;
//   console.log(userId)
//   if(userId == null) {
//     res.status(403);
//     return res.send('You need to sign in!');
//   }
//   // else {
//   //   let randomNum = Math.floor(Math.random() * 10) + 1;
//   //   let clientId = `abcd${randomNum}`;
//   //   console.log(clientId)
//   //   req.session.clientId = 'clientId';
//   //   // console.log(req.session.clientId)
//   //   req.session.myNum = randomNum;
//   //   res.status(200);
//   //   res.send('You are now logged in');
//   // }

//   const findExistId = users.find( user => user.id === userId)
//   if (!findExistId) {
//     return res.status(404).send({ error: true, msg: 'Eror:404 ID not found' })
//   }
//   next();
// };

// const authRole = (role) => {
//   return (req, res, next) => {
//     const userId = req.body.id;
//     const currentUser = users.find( user => user.id === userId );
//     const currentUserRole = currentUser.role;
//     if(currentUserRole !== role) {
//       res.status(401);
//       return res.send('Not Allowed');
//     }
//     next();
//   }
// };

//check for session id
// const sessionId = (req, res, next) => {
//   if(!req.session || !req.session.clientId) {
//     const err = new Error('Forbidden');
//     err.statusCode = 401;
//     next(err);
//   }
//   next();
// }

