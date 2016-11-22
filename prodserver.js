"use strict";
const compression = require('compression')
const express = require('express'),
    path = require('path');

const storeFactory = require('./labmonitor/lib/storage/storage-factory');
const sensor = require('./api/pi-sensor');
const report = require('./api/reports');
const services = require('./api/services');
const jira = require('./api/jira');
const bodyParser = require('body-parser');
const http = require('http');

const E2E_PORT = require('./constants').E2E_PORT;
const HOST = require('./constants').HOST;
const PROD_PORT = require('./constants').PROD_PORT;
const HTTP_PORT = require('./constants').HTTP_PORT;
const SSL_KEY = require('./constants').SSL_KEY;
const SSL_CERT = require('./constants').SSL_CERT;
const SSL_BUNDLE = require('./constants').SSL_BUNDLE;

const app = express();
const ROOT = path.join(path.resolve(__dirname, '..'));

let store = storeFactory.getStorageInstance('development');
if (!store) {
    console.error('Error creating storage for env');
}

app.use(compression());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('dist/client'));

const renderIndex = (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist/client/index.html'));
}

app.use('/api/sensor', sensor.getRoutes());
app.use('/api/report', report.getRoutes(store));
app.use('/api/sites', services.getRoutes(store));
app.use('/api/jira', jira.getRoutes());
app.get('/*', renderIndex);

const environment = process.env.NODE_ENV;
let e2e;
const ENV = process.env.npm_lifecycle_event;
if (ENV === 'e2e:server') { e2e = E2E_PORT };


if (environment === 'production') {
    const PORT = HTTP_PORT;
    let https = require('https'),      // module for https
        fs = require('fs');         // required to read certs and keys
    let options = {
        key: fs.readFileSync(SSL_KEY),
        cert: fs.readFileSync(SSL_CERT),
        ca: fs.readFileSync(SSL_BUNDLE),
        requestCert: false,
        rejectUnauthorized: false,
    };
    https.createServer(options, app).listen(`${PORT}`);
    console.log('HTTPS Express server listening on port ' + httpsPort);


    http.createServer((req, res) => {
        res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
        //res.writeHead(301, { "Location": "https://localhost:4400" });
        res.end();
    }).listen(`${PORT}`);
} else {
    const PORT = e2e || PROD_PORT;
    app.listen(PORT, () => {
        console.log(`Listening on: http://${HOST}:${PORT}`);
    });
}

