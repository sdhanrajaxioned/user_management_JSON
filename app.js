const express = require('express');
const fs = require('fs');
const app = express();

const usersData = fs.readFileSync('database.json')
const userJsonData = JSON.parse(usersData);
console.log(userJsonData);