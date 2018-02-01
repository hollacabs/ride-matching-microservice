const _ = require('lodash');
const axios = require('axios');
const coordinates = require('../coordinates');
const AWS = require('aws-sdk');
// const queueUrl = 'https://sqs.us-west-1.amazonaws.com/278687533626/eventlogger';

AWS.config.loadFromPath(path.resolve(__dirname, '../config.json'));

let sqs = new AWS.SQS({
  apiVersion: '2012-11-05'
});

module.exports = {
  pickUpCity : (pickUpLocation) => {
    return _.findKey(coordinates, (city) => {
      return (pickUpLocation[0] > city.longitude[0] && pickUpLocation[0] < city.longitude[1]) &&
        (pickUpLocation[1] < city.latitude[0] && pickUpLocation[1] > city.latitude[1])
    })
  },

  uuidv4 : () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  },

  eventLogger: (messageBody) => {
    let params = {
      MessageBody: JSON.stringify(messageBody),
      QueueUrl: queueUrl,
      DelaySeconds: 0
    }
    return new Promise((resolve, reject) => {
      sqs.sendMessage(params, (err, data) => {
        if (err) {
            console.log('Error sending message', err)
        reject(err)
            } else {
            console.log('Message send success, ', data)
        resolve(data);
          };
      });
    })
  }
}
