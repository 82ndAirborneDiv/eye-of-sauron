"use strict";
const compression = require('compression')
const express = require('express'),
    path = require('path');

const storeFactory = require('./labmonitor/lib/storage/storage-factory');
const sensor = require('./api/pi-sensor');
const report = require('./api/reports');
const services = require('./api/services');
const bodyParser = require('body-parser');

const E2E_PORT = require('./constants').E2E_PORT;
const HOST = require('./constants').HOST;
const PROD_PORT = require('./constants').PROD_PORT;

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
app.get('/*', renderIndex);

let e2e;
const ENV = process.env.npm_lifecycle_event;
if (ENV === 'e2e:server') { e2e = E2E_PORT };
const PORT = e2e || PROD_PORT;

app.listen(PORT, () => {
    console.log(`Listening on: http://${HOST}:${PORT}`);
});