const AWS = require('aws-sdk');
const { rideMatching } = require('./config');
const Consumer = require('sqs-consumer');

let sqs = new AWS.SQS({
  apiVersion: '2012-11-05',
  region: rideMatching.region,
  credentials: new AWS.Credentials(rideMatching.accessKeyId, rideMatching.secretAccessKey)
});

const consumer = Consumer.create({
  queueUrl: rideMatching.url,
  sqs: sqs,
  handleMessage: (message, done) => {
    console.log(message);
    done();
  }
})

consumer.start();
