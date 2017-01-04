var nodemailer = require('nodemailer');
var sesTransport = require('nodemailer-ses-transport');
var htmlToText = require('nodemailer-html-to-text').htmlToText;
// var moment = require('moment');
var moment = require('moment-timezone');

var AWSKEYID = require('../../constants').AWSKEYID;
var AWSKEYSECRET = require('../../constants').AWSKEYSECRET;
var AWSREGION = require('../../constants').AWSREGION;

var monitorTime = +new Date;

module.exports = function () {

    var service = {
        sendDownEmail: sendDownEmail,
        sendUpEmail: sendUpEmail,
        sendTempWarning: sendTempWarning
    };

    var sesOptions = {
        accessKeyId: AWSKEYID,
        secretAccessKey: AWSKEYSECRET,
        rateLimit: 5,
        region: AWSREGION
    }

    var senderEmail = '"Sauron" <InformaticsLab@cdc.gov>';
    var emailRecipientList = ['technical.ta@gmail.com', 'hkr3@cdc.gov', 'azn6@cdc.gov', 'dhi4@cdc.gov', 'sdavid@deloitte.com', 'kta@deloitte.com', 'Marypeck9@gmail.com', 'ldi3@cdc.gov', 'trunguyen@deloitte.com'];
    // var emailRecipientList = ['technical.ta@gmail.com', 'kta@deloitte.com']; //testing list

    var awsTransporter = nodemailer.createTransport(sesTransport(sesOptions));

    return service;

    /////////////////////////////////////////////

    function sendTempWarning(serverRoomTemp, warningTime) {
        //TODO
        var now = +new Date;
        var shouldSend = false;
        var sendHeatWarning = awsTransporter.templateSender({
            subject: '**WARNING** Air temperature in server room is high!',
            text: '**WARNING** Current server room temperature: {{serverRoomTemp}}at {{currentTime}} is over the specified threshold.',
            html: `<p>**<b>WARNING</>**</b></p> <p>Server room air temperature: <b>{{serverRoomTemp}}&deg;F</b></p>
            <p>Time: <b>{{currentTime}}</b><p/> 
            <p>This is over the specified threshold of <b>93&deg;F</b>.</p>
            <p>Please seek assistance from the infrastructure team.</p>`
        }, {
                from: senderEmail
            }
        );

        shouldSend = notificationlimiter(warningTime);

        if (shouldSend) {
            sendHeatWarning({
                to: emailRecipientList
            }, {
                    serverRoomTemp: serverRoomTemp.toFixed(2),
                    currentTime: moment(now).tz('America/New_York').format('h:mm:ss A, MMMM Do YYYY')
                }, (err, info) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('Overheat warning sent');
                    }
                }
            );
        }

    }

    function sendDownEmail(service, outageData) {

        var errorType = outageData

        var sendDownNotification = awsTransporter.templateSender({
            subject: '{{service}} is down!',
            text: 'This is a notification that <b>{{service}}</b> is currently down. Please monitor Sauron for more details',
            html: `<p><b>{{service}}</b> (<a href="{{serviceUrl}}">{{serviceUrl}})</a> has gone down at <b>{{downAt}}</b>.</p> 
            <p><b>{{errorType}}</b></p>`
        }, {
                from: senderEmail
            }
        );

        sendDownNotification({
            to: emailRecipientList
        }, {
                service: service.name,
                serviceUrl: service.url,
                downAt: moment(outageData.timestamp).tz('America/New_York').format('h:mm:ss A, MMMM Do YYYY'),
                errorType: outageData.error,
                sauron: 'https://sauron.phiresearchlab.org/'
            }, (err, info) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log('Down message sent');
                }
            }
        );

    }

    function sendUpEmail(service, upAt) {

        var sendUpNotification = awsTransporter.templateSender({
            subject: '{{service}} has been restored!',
            text: '{{service}}is now back up!',
            html: '<p><b>{{service}}</b> (<a href="{{serviceUrl}}">{{serviceUrl}})</a> has been restored and is back online.</p>'
        }, {
                from: senderEmail
            }
        );

        sendUpNotification({
            to: emailRecipientList
        }, {
                service: service.name,
                serviceUrl: service.url
            }, (err, info) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log('Up message sent');
                }
            }
        );
    }


    function notificationlimiter(messageTime) {
        var sentTime = moment(messageTime);
        var currentTime = moment(monitorTime);
        var messageBufferTime = 30; //in minutes

        var diff = moment.utc(moment(sentTime, "DD/MM/YYYY HH:mm:ss").diff(moment(currentTime, "DD/MM/YYYY HH:mm:ss"))).format("mm");

        console.log(diff);
        if (diff >= messageBufferTime) {
            console.log(true);
            monitorTime = +new Date;
            return true;
        } else {
            // return false;
            console.log(false);
        }
    }

};