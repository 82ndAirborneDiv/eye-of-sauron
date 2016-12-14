const nodemailer = require('nodemailer');
const sesTransport = require('nodemailer-ses-transport');
const htmlToText = require('nodemailer-html-to-text').htmlToText;
const moment = require('moment');

const AWSKEYID = require('../../constants').AWSKEYID;
const AWSKEYSECRET = require('../../constants').AWSKEYSECRET;
const AWSREGION = require('../../constants').AWSREGION;

let monitorTime = +new Date;

module.exports = function () {

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
    const emailRecipientList = ['technical.ta@gmail.com', 'hkr3@cdc.gov', 'azn6@cdc.gov', 'dhi4@cdc.gov', 'sdavid@deloitte.com'];
    // const emailRecipientList = ['technical.ta@gmail.com', 'kta@deloitte.com', 'sdavid@deloitte.com']; //testing list

    let awsTransporter = nodemailer.createTransport(sesTransport(sesOptions));

    // const transporter = nodemailer.createTransport(smtpConfig);

    return service;

    /////////////////////////////////////////////

    function sendTempWarning(serverRoomTemp, warningTime) {
        //TODO
        let now = +new Date;
        let shouldSend = false;
        let sendHeatWarning = awsTransporter.templateSender({
            subject: '**WARNING** Air temperature in server room is high (TEST)',
            text: '**WARNING** Current server room temperature: {{serverRoomTemp}}at {{currentTime}} is over the specified threshold.',
            html: `<p>**<b>WARNING</>**</b></p> <p>Server room air temperature: <b>{{serverRoomTemp}}&deg;F</b></p>
            <p>Time: <b>{{currentTime}}</b><p/> 
            <p>This is over the specified threshold of <b>93&deg;F</b>.</p>
            <p>Please seek assistance from the infrastructure team.</p>`
        }, {
                from: senderEmail
            }
        );
        // console.log('warningTime', warningTime);
        shouldSend = notificationlimiter(warningTime);

        if (shouldSend) {
            sendHeatWarning({
                to: emailRecipientList
            }, {
                    serverRoomTemp: serverRoomTemp.toFixed(2),
                    currentTime: moment(now).format('h:mm:ss a, MMMM Do YYYY')
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

        // let downAt = moment(outageData.timestamp).format('MMMM Do YYYY, h:mm:ss a');
        let errorType = outageData

        let sendDownNotification = awsTransporter.templateSender({
            subject: '{{service}} is down! (TEST)',
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
            subject: '{{service}} has been restored! (TEST)',
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
        let sentTime = moment(messageTime);
        let currentTime = moment(monitorTime);
        let messageBufferTime = 30; //in minutes

        let diff = moment.utc(moment(sentTime, "DD/MM/YYYY HH:mm:ss").diff(moment(currentTime, "DD/MM/YYYY HH:mm:ss"))).format("mm");

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