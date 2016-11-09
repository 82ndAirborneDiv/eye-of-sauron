var http = require('http'),
  express = require('express'),
  request = require('request');

module.exports.getRoutes = function () {
  var router = express.Router();

  router.get('/data', function (req, res) {
    var url = 'http://12.96.10.100:3000';

    request(url, function (error, response, body) {
      if (!error && response.statusCode === 200) {

        var parsedObj = JSON.parse(body);
        res.send(parsedObj.variables.sensorData);
      } else {
        console.log('sensor error', error);
      }
    });
  });

  return router;
};