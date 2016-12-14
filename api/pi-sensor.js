var http = require('http'),
  express = require('express'),
  request = require('request');
var moment = require('moment');

var mailer = require('../labmonitor/lib/mailer')();

let notificationTime;

module.exports.getRoutes = function () {
  var router = express.Router();

  router.get('/data', function (req, res) {
    var url = 'http://12.96.10.100:3000';

    request(url, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        var parsedObj = JSON.parse(body);
        let currentTemp = parsedObj.variables.sensorData.temperature;

        if (currentTemp > 93) {
          // if (true) {  //for testing
          notificationTime = +new Date;

          mailer.sendTempWarning(currentTemp, notificationTime);   //currently disabled until I see how they want to deal with notifcations
        }


        // console.log(parsedObj);

        res.send(parsedObj.variables.sensorData);
      } else {
        console.log('sensor error', error);
      }
    });
  });



  return router;
};