const AWS = require('aws-sdk');
const { rideMatching } = require('./config');

let sqs = new AWS.SQS({
  apiVersion:'2012-11-05', 
  region: rideMatching.region,
  credentials: new AWS.Credentials(rideMatching.accessKeyId, rideMatching.secretAccessKey)
});

let message, params;

for (var i = 0; i < 100; i++) {
  message = { testmessage: i };
  params = {
    MessageBody: JSON.stringify(message),
    QueueUrl: rideMatching.url
  }
  sqs.sendMessage(params, (err, data) => {
    if (err) console.log(err);
    else console.log(data);
  })
}
