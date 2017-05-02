var http = require('http'),
  express = require('express'),
  request = require('request');
var moment = require('moment');

var mailer = require('../labmonitor/lib/mailer')();

var notificationTime;
var thresholdCount = 0;

module.exports.getRoutes = function () {
  var router = express.Router();

  router.get('/data', function (req, res) {
    var url = 'http://raspberry.phiresearchlab.org';

    request(url, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        var parsedObj = JSON.parse(body);
        var currentTemp = parsedObj.variables.sensorData.temperature;

        if (currentTemp > 93) {
          // if (true) {  //for testing
          thresholdCount++;

          if (thresholdCount > 5) {
            notificationTime = +new Date;
            mailer.sendTempWarning(currentTemp, notificationTime);   //currently disabled until I see how they want to deal with notifcations
            thresholdCount = 0;
          }
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