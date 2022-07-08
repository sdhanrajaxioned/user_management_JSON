const fs = require('fs');

//read data from json file
const getUsersData = () => {
  const jsonData = fs.readFileSync('users.json');
  return JSON.parse(jsonData);
}

//writing data to json file
const saveUserData = (data) => {
  const stringifyData = JSON.stringify(data, null, 2);
  fs.writeFileSync('users.json', stringifyData);
}

module.exports.getUser = getUsersData;
module.exports.saveUser = saveUserData;
