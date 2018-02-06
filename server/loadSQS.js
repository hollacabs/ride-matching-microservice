const AWS = require('aws-sdk');
const { rideMatchingIngress } = require('../config');

let sqs = new AWS.SQS({
  apiVersion:'2012-11-05', 
  region: rideMatchingIngress.region,
  credentials: new AWS.Credentials(rideMatchingIngress.accessKeyId, rideMatchingIngress.secretAccessKey)
});

let message, params;

for (var i = 0; i < 1000; i++) {
  message = { testmessage: i };
  params = {
    MessageBody: JSON.stringify({
      // driverId: i
      userId: 1,
      pickUpLocation: [-87.7947, 41.8454],
      dropOffLocation: [-87.7147, 41.8354],
      rideDuration: 5,
      priceTimestamp: "2018-01-30 07:05:45-08:00",
      city: "sanFrancisco"
    }),
    QueueUrl: rideMatchingIngress.url
  }
  sqs.sendMessage(params, (err, data) => {
    if (err) console.log(err);
    else console.log(data);
  })
}
