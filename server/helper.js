const _ = require('lodash');
const axios = require('axios');
const coordinates = require('../coordinates');
const { rideMatchingSQS, eventLoggerSQS } = require('./index');
const { rideMatchingEgress, eventLogger } = require('../config');

module.exports = {

  uuidv4 : () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  },

  eventLoggerQueue: (messageBody) => {
    let params = {
      MessageBody: JSON.stringify(messageBody),
      QueueUrl: eventLogger.url,
      DelaySeconds: 0
    }
    eventLoggerSQS.sendMessage(params, (err, data) => {
      if (err) console.log(err);
    });
  },
  egressQueue: (result) => {
    let params = {
      MessageBody: JSON.stringify(result),
      QueueUrl: rideMatchingEgress.url
    }
    rideMatchingSQS.sendMessage(params, (err, data) => {
      if (err) console.log(err);
    });
  }

    // pickUpCity : (pickUpLocation) => {
  //   return _.findKey(coordinates, (city) => {
  //     return (pickUpLocation[0] > city.longitude[0] && pickUpLocation[0] < city.longitude[1]) &&
  //       (pickUpLocation[1] < city.latitude[0] && pickUpLocation[1] > city.latitude[1])
  //   })
  // },
}
