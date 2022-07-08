const exp = require('constants');
const express = require('express');
const userRouter = require('./routes/users');
const app = express();
const port = 3000;


app.use('/users', userRouter);
 
//server On
app.listen(port, console.log(`listening on ${port} ...`))