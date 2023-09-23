
// iss_promised.js

const request = require('request-promise-native');

const fetchMyIP = function() {
  return request('https://api.ipify.org?format=json');
};

const fetchMyCoordinatesByIP = function(body) {
  const parsedBody = JSON.parse(body);
  return request(`https://ipwho.is/${parsedBody.ip}`);
};

const fetchTheMockISSData = function(coordinates) {
  const {latitude, longitude} = JSON.parse(coordinates);
  return request(`https://iss-flyover.herokuapp.com/json/?lat=${latitude}&lon=${longitude}`);
};

const printPassTimes = function(body) {
  const {response} = JSON.parse(body);
  for (const pass of response) {
    const dateTime = new Date(0);
    dateTime.setUTCSeconds(pass.risetime);
    const minutes = Math.round(pass.duration / 60);
    console.log(`Next pass at ${dateTime} for ${minutes} minutes!`);
  }
};

const nextISSTimesForMyLocation = function() {
  fetchMyIP()
    .then(fetchMyCoordinatesByIP)
    .then(fetchTheMockISSData)
    .then(printPassTimes)
    .catch((error) => {
      console.log(`It didn't work! ${error.message}`);
    });
};



module.exports = { nextISSTimesForMyLocation };