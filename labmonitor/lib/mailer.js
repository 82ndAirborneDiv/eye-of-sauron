const nodemailer = require('nodemailer');
const sesTransport = require('nodemailer-ses-transport');
const htmlToText = require('nodemailer-html-to-text').htmlToText;
const moment = require('moment');

const AWSKEYID = require('../../constants').AWSKEYID;
const AWSKEYSECRET = require('../../constants').AWSKEYSECRET;
const AWSREGION = require('../../constants').AWSREGION

module.exports = function() {

    let service = {
        sendDownEmail: sendDownEmail,
        sendUpEmail: sendUpEmail,
        sendTempWarning: sendTempWarning
    };

    const sesOptions = {
        accessKeyId: AWSKEYID,
        secretAccessKey: AWSKEYSECRET,
        rateLimit: 5,
        region: AWSREGION
    }

    const senderEmail = '"Sauron" <InformaticsLab@cdc.gov>';
    // const emailRecipientList = ['technical.ta@gmail.com', 'hkr3@cdc.gov', 'azn6@cdc.gov', 'dhi4@cdc.gov'];
    const emailRecipientList = 'technical.ta@gmail.com';

    let awsTransporter = nodemailer.createTransport(sesTransport(sesOptions));

    // const transporter = nodemailer.createTransport(smtpConfig);

    return service;

    /////////////////////////////////////////////

    function sendTempWarning(serverRoomTemp) {
        //TODO
        let now = +new Date;
        let sendHeatWarning = awsTransporter.templateSender({
            subject: '**WARNING** SERVER ROOM OVERHEATING (TEST)',
            text: '**WARNING** Current server room temperature: {{serverRoomTemp}} is over the specified threshold at {{currentTime}}',
            html: `<p>**<b>WARNING</>**</b> Current server room temperature: {{serverRoomTemp}} is over the specified threshold.</p>
            <p>Please seek assistance from the infracstructure team.</p>`
        }, {
                from: senderEmail
            }
        );

        sendHeatWarning({
            to: emailRecipientList
        }, {
                serverRoomTemp: serverRoomTemp,
                currentTime: moment(now).format('h:mm:ss a, MMMM Do YYYY')
            }, (err, info) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log('Overheat warning sent');
                }
            })
    }

    function sendDownEmail(service, outageData) {

        // let downAt = moment(outageData.timestamp).format('MMMM Do YYYY, h:mm:ss a');
        let errorType = outageData

        let sendDownNotification = awsTransporter.templateSender({
            subject: '{{service}} is down! (TEST)',
            text: 'This is a notification that <b>{{service}}</b> is currently down. Please monitor Sauron for more details',
            html: `<p><b>{{service}}</b> (<a href="{{serviceUrl}}">{{serviceUrl}})</a> has gone down at <b>{{downAt}}</b>.</p> 
            <p>{{errorType}}</p>
            <p> Please monitor <a href="{{sauron}}">Sauron</a> for more details.</p>`
        }, {
                from: senderEmail
            }
        );

        sendDownNotification({
            to: emailRecipientList
        }, {
                service: service.name,
                serviceUrl: service.url,
                downAt: moment(outageData.timestamp).format('h:mm:ss a, MMMM Do YYYY'),
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

        let sendUpNotification = awsTransporter.templateSender({
            subject: '{{service}} is back up! (TEST)',
            text: '{{service}}is now back up!',
            html: '<p><b>{{service}}</b> (<a href="{{serviceUrl}}">{{serviceUrl}})</a> is now back up!</p>'
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

};