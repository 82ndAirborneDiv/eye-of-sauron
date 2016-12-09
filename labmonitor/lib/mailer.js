const nodemailer = require('nodemailer');
const mg = require('nodemailer-mailgun-transport');
const htmlToText = require('nodemailer-html-to-text').htmlToText;
const moment = require('moment');

module.exports = function () {

  let service = {
    sendDownEmail: sendDownEmail,
    sendUpEmail: sendUpEmail
  };

  const auth = {
    auth: {
      api_key: 'key-d8ad487b612b9f5fbdd0ff2cc4e79d00',
      domain: 'sandbox6794d726b626405582a716f4bc6aa923.mailgun.org'
    }
  };

  const senderEmail = 'postmaster@sandbox6794d726b626405582a716f4bc6aa923.mailgun.org';
  const emailRecipientList = [];

  const nodemailerMailgun = nodemailer.createTransport(mg(auth));

  // const transporter = nodemailer.createTransport(smtpConfig);

  return service;

  /////////////////////////////////////////////

  function sendDownEmail(service, outageData) {

    let downAt = moment(outageData.timestamp).format('MMMM Do YYYY, h:mm:ss a');

    let sendDownNotification = nodemailerMailgun.templateSender({
      subject: '{{service}} is down!',
      text: 'This is a notification that <b>{{service}}</b> is currently down. Please monitor Sauron for more details',
      html: '<p><b>{{service}}</b> (<a href="{{serviceUrl}}">{{serviceUrl}})</a> has gone down on <b>{{downAt}}</b>.</p> <p> Please monitor <a href="{{sauron}}">Sauron</a> for more details.</p>'
    }, {
        from: senderEmail
      }
    );

    sendDownNotification({
      to: 'technical.ta@gmail.com'
    }, {
        service: service.name,
        serviceUrl: service.url,
        downAt: downAt,
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

    let sendUpNotification = nodemailerMailgun.templateSender({
      subject: '{{service}} is back up!',
      text: '{{service}}is now back up!',
      html: '<p><b>{{service}}</b> (<a href="{{serviceUrl}}">{{serviceUrl}})</a> is now back up!</p>'
    }, {
        from: senderEmail
      }
    );

    sendUpNotification({
      to: 'technical.ta@gmail.com'
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