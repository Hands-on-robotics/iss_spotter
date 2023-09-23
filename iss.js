
// iss.js

const request = require('request');


const fetchMyIP = function(callback) {
  
  request("https://api.ipify.org?format=json", function(error, response, body) {
    if (error) return callback(error, null);
    
    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching IP. Response ${body}`), null);
      return;
    }
    
    const ip = JSON.parse(body);
    callback(null, ip);
  });
};



const fetchMyCoordinatesByIP = function(ip, callback) {
  
  request(`https://ipwho.is/${ip.ip}`, function(error, response, body) {
    if (error) return callback(error, null);
    
    const parsedBody = JSON.parse(body);
    if (!("latitude" in parsedBody)) {
      callback((`Response from api says ${parsedBody.message}. Please check the IP address`), null);
      return;
    }
    
    const { latitude, longitude } = parsedBody;
    
    callback(null, { latitude, longitude });
  });
};



const fetchTheMockISSData = function(coordinates, callback) {
  
  const { latitude, longitude } = coordinates;
  
  request(`https://iss-flyover.herokuapp.com/json/?lat=${latitude}&lon=${longitude}`, (error, resp, body) => {
    
    if (error) return callback(error, null);
    
    if (resp.statusCode !== 200) return callback(`API says: ${body}, when fetching ISS passing times. Status Code: ${resp.statusCode} `, null);
    
    const parsedBody = JSON.parse(body);
    const { message, response } = parsedBody;

    if (message === "success") return callback(null, response);
  });
};



const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }

    fetchMyCoordinatesByIP(ip, (error, loc) => {
      if (error) {
        return callback(error, null);
      }

      fetchTheMockISSData(loc, (error, nextPasses) => {
        if (error) {
          return callback(error, null);
        }

        callback(null, nextPasses);
      });
    });
  });
};

module.exports = { nextISSTimesForMyLocation };
