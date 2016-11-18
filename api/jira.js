var http = require('http'),
    express = require('express'),
    request = require('request'),
    _ = require('lodash');

module.exports.getRoutes = function() {
    var router = express.Router();
    var auth = {
        'auth': {
            'user': 'eyeofsauron',
            'pass': 'B1scuits'
        }
    };

    function IssueObject(id, key, priority, status, summary, reservedDate) {
        this.id = id;
        this.key = key;
        this.priority = priority;
        this.status = status;
        this.summary = summary;
        this.reservedDate = reservedDate;
    }

    function UnresolvedObject(id, key, summary, assignee, creator) {
        this.id = id;
        this.key = key;
        this.summary = summary;
        this.assignee = assignee;
        this.creator = creator;
    }

    router.get('/reservations', function(req, res) {
        var reservationsQuery = 'https://jira.phiresearchlab.org/rest/api/2/search?jql=project%20%3D%20IIUSD%20AND%20issuetype%20%3D%20%22Room%20Request%22%20AND%20status%20%3D%20%22Room%20Reserved%22';

        request(reservationsQuery, auth, function(error, response, body) {
            if (!error && response.statusCode === 200) {
                var dateNow = +new Date();
                var parsedObj = JSON.parse(body);
                var roomReservationArray = [];
                parsedObj = parsedObj.issues;

                for (var i = 0; i < parsedObj.length; i++) {
                    if (parsedObj[i].fields.customfield_10863 !== null) {
                        var date1Obj =
                            new IssueObject(
                                parsedObj[i].id,
                                parsedObj[i].key,
                                parsedObj[i].fields.priority.name,
                                parsedObj[i].fields.status.name,
                                parsedObj[i].fields.summary,
                                Date.parse(parsedObj[i].fields.customfield_10863)
                            );
                        roomReservationArray.push(date1Obj);
                    }
                    if (parsedObj[i].fields.customfield_11102 !== null) {
                        var date2Obj =
                            new IssueObject(
                                parsedObj[i].id,
                                parsedObj[i].key,
                                parsedObj[i].fields.priority.name,
                                parsedObj[i].fields.status.name,
                                parsedObj[i].fields.summary,
                                Date.parse(parsedObj[i].fields.customfield_11102)
                            );
                        roomReservationArray.push(date2Obj);
                    }
                    if (parsedObj[i].fields.customfield_11103 !== null) {
                        var date3Obj =
                            new IssueObject(
                                parsedObj[i].id,
                                parsedObj[i].key,
                                parsedObj[i].fields.priority.name,
                                parsedObj[i].fields.status.name,
                                parsedObj[i].fields.summary,
                                Date.parse(parsedObj[i].fields.customfield_11103)
                            );
                        roomReservationArray.push(date3Obj);
                    }
                    if (parsedObj[i].fields.customfield_11104 !== null) {
                        var date4Obj =
                            new IssueObject(
                                parsedObj[i].id,
                                parsedObj[i].key,
                                parsedObj[i].fields.priority.name,
                                parsedObj[i].fields.status.name,
                                parsedObj[i].fields.summary,
                                Date.parse(parsedObj[i].fields.customfield_11104)
                            );
                        roomReservationArray.push(date4Obj);
                    }
                    if (parsedObj[i].fields.customfield_11105 !== null) {
                        var date5Obj =
                            new IssueObject(
                                parsedObj[i].id,
                                parsedObj[i].key,
                                parsedObj[i].fields.priority.name,
                                parsedObj[i].fields.status.name,
                                parsedObj[i].fields.summary,
                                Date.parse(parsedObj[i].fields.customfield_11105)
                            );
                        roomReservationArray.push(date5Obj);
                    }
                    if (parsedObj[i].fields.customfield_11106 !== null) {
                        var date6Obj =
                            new IssueObject(
                                parsedObj[i].id,
                                parsedObj[i].key,
                                parsedObj[i].fields.priority.name,
                                parsedObj[i].fields.status.name,
                                parsedObj[i].fields.summary,
                                Date.parse(parsedObj[i].fields.customfield_11106)
                            );
                        roomReservationArray.push(date6Obj);
                    }
                }
                var filteredArray = [];
                for (var j = 0; j < roomReservationArray.length; j++) {
                    if (roomReservationArray[j].reservedDate >= dateNow) {
                        filteredArray.push(roomReservationArray[j]);
                    }
                }
                filteredArray = _.orderBy(filteredArray, ['reservedDate'], ['asc']);
                // console.log(filteredArray);
                return res.send(filteredArray);
            } else {
                console.log(error);
            }
        });

    });

    router.get('/issues', function(req, res) {
        var completedCountQuery = 'https://jira.phiresearchlab.org/rest/api/2/search?jql=project%20%3D%2011900%20AND%20resolution%20%3D%20Complete';
        var unresolvedCountQuery = 'https://jira.phiresearchlab.org/rest/api/2/search?jql=project%20%3D%2011900%20AND%20resolution%20is%20EMPTY';
        var canceledCountQuery = 'https://jira.phiresearchlab.org/rest/api/2/search?jql=project%20%3D%2011900%20AND%20resolution%20%3D%20Canceled';

        var chartData = [];
        request(completedCountQuery, auth, function(error, response, body) {
            if (!error && response.statusCode === 200) {
                var parsedObj = JSON.parse(body);
                // console.log(parsedObj);

                chartData.push(parsedObj.total);

                request(unresolvedCountQuery, auth, function(error, response, body) {
                    if (!error && response.statusCode === 200) {
                        var parsedObj = JSON.parse(body);

                        chartData.push(parsedObj.total);
                        request(canceledCountQuery, auth, function(error, response, body) {
                            if (!error && response.statusCode === 200) {
                                var parsedObj = JSON.parse(body);
                                chartData.push(parsedObj.total);
                                return res.send(chartData);
                            } else {
                                console.log('error here', error);
                            }
                        });
                    } else {
                        console.log(error);
                    }
                });
            } else {
                console.log(error);
            }
        });
    });

    router.get('/unresolved', function(req, res) {
        var unresolvedQuery = 'https://jira.phiresearchlab.org/rest/api/2/search?jql=project%20%3D%20IIUSD%20AND%20issuetype%20in%20standardIssueTypes()%20AND%20resolution%20%3D%20Unresolved';

        request(unresolvedQuery, auth, function(error, response, body) {
            if (!error && response.statusCode === 200) {
                var parsedObj = JSON.parse(body);
                var unresolvedArray = [];

                parsedObj = parsedObj.issues;

                for (var i = 0; i < parsedObj.length; i++) {
                    if (parsedObj[i].fields.assignee !== null && parsedObj[i].fields.creator !== null) {
                        var composedObj = new UnresolvedObject(
                            parsedObj[i].id,
                            parsedObj[i].key,
                            parsedObj[i].fields.summary,
                            parsedObj[i].fields.assignee.displayName,
                            parsedObj[i].fields.creator.displayName
                        );
                        unresolvedArray.push(composedObj);
                    }
                }
                unresolvedArray = _.orderBy(unresolvedArray, ['key'], ['asc']);
                res.send(unresolvedArray);
            } else {
                console.log(error);
                res.send(error);
            }
        });
    });


    return router;
};

