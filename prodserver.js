"use strict";
var compression = require('compression')
var express = require('express'),
    path = require('path');

var storeFactory = require('./labmonitor/lib/storage/storage-factory');
var sensor = require('./api/pi-sensor');
var report = require('./api/reports');
var services = require('./api/services');
var jira = require('./api/jira');
var bodyParser = require('body-parser');
var http = require('http');

var E2E_PORT = require('./constants').E2E_PORT;
var HOST = require('./constants').HOST;
var PROD_PORT = require('./constants').PROD_PORT;
var HTTPS_PORT = require('./constants').HTTP_PORT;
var SSL_KEY = require('./constants').SSL_KEY;
var SSL_CERT = require('./constants').SSL_CERT;
var SSL_BUNDLE = require('./constants').SSL_BUNDLE;

var app = express();
var ROOT = path.join(path.resolve(__dirname, '..'));

var store = storeFactory.getStorageInstance('development');
if (!store) {
    console.error('Error creating storage for env');
}

var environment = process.env.NODE_ENV;

app.use(compression());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api/sensor', sensor.getRoutes());
app.use('/api/report', report.getRoutes(store));
app.use('/api/sites', services.getRoutes(store));
app.use('/api/jira', jira.getRoutes());

if (environment === 'dev') {
   app.use(express.static('./src/client'));
   app.use('/*', express.static('./src/index.html'));
   app.use(express.static('./dll'));
   app.use(express.static('./src'));
} else {
  var renderIndex = (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist/client/index.html'))
  }
  app.use(express.static('dist/client'));
  app.get('/*', express.static('./dist/index.html'));
}

var e2e;
var ENV = process.env.npm_lifecycle_event;
if (ENV === 'e2e:server') { e2e = E2E_PORT };

if (environment === 'production') {
    var PORT = HTTPS_PORT;
    var https = require('https'),      // module for https
        fs = require('fs');         // required to read certs and keys
    var options = {
        key: fs.readFileSync(SSL_KEY),
        cert: fs.readFileSync(SSL_CERT),
        ca: fs.readFileSync(SSL_BUNDLE),
        requestCert: false,
        rejectUnauthorized: false,
    };
    https.createServer(options, app).listen(`${PORT}`);
    console.log('HTTPS Express server listening on port ' + `${PORT}`);


    http.createServer((req, res) => {
        res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
        //res.writeHead(301, { "Location": "https://localhost:4400" });
        res.end();
    }).listen(PROD_PORT);
} else {
    var PORT = e2e || PROD_PORT;
    app.listen(PORT, () => {
        console.log(`Listening on: http://${HOST}:${PORT}`);
    });
}

