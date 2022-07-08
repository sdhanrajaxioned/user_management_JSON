const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

//read data from json file
const getUsersData = () => {
  const jsonData = fs.readFileSync('users.json');
  return JSON.parse(jsonData);
}

//writing data to json file
const saveUserData = (data) => fs.writeFileSync('users.json', JSON.stringify(data));

app.listen(port, console.log(`listening on ${port} ...`))