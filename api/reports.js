var express = require('express'),
  ReporterFactory = require('../labmonitor/lib/reporter'),
  _ = require('lodash');

module.exports.getRoutes = function (store) {
  if (!store) {
    throw new Error('data store needed');
  }

  var reporter = new ReporterFactory(store);
  var router = express.Router();

  function handlePrivateFields(service) {
    delete service.alertTo;

    service.isRestricted = !!service.restrictedTo;

    delete service.restrictedTo;
    return service;
  }

  // Load service report

  router.get('/services/:id', function (req, res) {
    if (!req.params.id) {
      return res.status(400).json({ error: 'ID not found' });
    }
    reporter.getService(req.params.id, function (err, serviceReport) {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: err });
      }
      if (!serviceReport) {
        return res.status(404).json({ error: 'Service not found' });
      }
      serviceReport.service = handlePrivateFields(serviceReport.service);
      res.json(serviceReport);
    });
  });

  // Load all services report

  router.get('/services', function (req, res) {
    reporter.getServices({}, function (err, serviceReports) {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: err });
      }
      var sortedReports = _.orderBy(serviceReports, ['service.name'], ['asc']);
      res.json(sortedReports);
    });
  });

  return router;
};
