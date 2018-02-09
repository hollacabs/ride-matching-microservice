const AWS = require('aws-sdk');
const { rideMatchingIngress } = require('../config');
const { rideMatchingSQS } = require('./sqs');

let params;

for (var i = 1; i < 11; i++) {
  params = {
    MessageBody: JSON.stringify({
      driverId: i
      // userId: 1,
      // pickUpLocation: [-96, 41.25],
      // dropOffLocation: [-96, 41.25],
      // rideDuration: 5,
      // priceTimestamp: "2018-01-30 07:05:45-08:00",
      // city: "sanFrancisco"
    }),
    QueueUrl: rideMatchingIngress.url
  }
  rideMatchingSQS.sendMessage(params, (err, data) => {
    if (err) console.log(err);
    else console.log(data);
  })
}
