const { rideMatchingSQS, rideMatchingEgressSQS } = require('../server/sqs');
const { rideMatchingIngress, rideMatchingEgress } = require('../config');

describe('Driver Matching end-to-end', () => {
  test('Requests to the ingress queue should eventually be available in the egress queue', (done) => {
    let sendParams = {
      MessageBody: JSON.stringify({
        userId: 1,
        pickUpLocation: [-87.7947, 41.8454],
        dropOffLocation: [-87.7147, 41.8354],
        rideDuration: 5,
        priceTimestamp: '2018-01-30 07:05:45-08:00',
        city: "sanFrancisco"
      }),
      QueueUrl: rideMatchingIngress.url
    };

    let receiveParams = {
      QueueUrl: rideMatchingEgress.url,
      WaitTimeSeconds: 15
    };

    rideMatchingSQS.sendMessage(sendParams, (err, data) => {
      if (err) console.log(err);
    });

    function callback (err, data) {
      expect(JSON.parse(data.Messages[0].Body).pickUpLocation[0]).toBe(-87.7947);
      done();
    }

    rideMatchingEgressSQS.receiveMessage(receiveParams, callback);
  });
})

describe('Driver Stats end-to-end', () => {
  test('Requests to the ingress queue should eventually be available in the egress queue', (done) => {
    let sendParams = {
      MessageBody: JSON.stringify({
        driverId: 10435
      }),
      QueueUrl: rideMatchingIngress.url
    };

    let receiveParams = {
      QueueUrl: rideMatchingEgress.url,
      WaitTimeSeconds: 15
    };

    rideMatchingSQS.sendMessage(sendParams, (err, data) => {
      if (err) console.log(err);
    });

    function callback(err, data) {
      console.log(data);
      expect(data).toBe(-87.7947);
      done();
    }

    rideMatchingEgressSQS.receiveMessage(receiveParams, callback);
  });
})

