const AWS = require('aws-sdk');
const coordinates = require('../coordinates');
const { rideMatchingIngress } = require('../config');
const { rideMatchingSQS } = require('./sqs');

let params;
let date = new Date();

let randomCityGenerator = (driverId) => {
  let cities = Object.keys(coordinates);
  return cities[driverId % cities.length];
}

let randomCoordinates = (city) => {
  return [city.longitude[0] - Math.random() * (city.longitude[0] - city.longitude[1]), city.latitude[0] - Math.random() * (city.latitude[0] - city.latitude[1])]
}

let city;
let coords;
for (var i = 1; i < 10; i++) {
  city = randomCityGenerator(Math.floor(Math.random() * 100000));
  coords = randomCoordinates(coordinates[city]);
  params = {
    MessageBody: JSON.stringify({
      // driverId: i
      userId: i,
      pickUpLocation: coords,
      dropOffLocation: coords,
      rideDuration: 5,
      priceTimestamp: "2018-01-30 07:05:45-08:00",
      city: "sanFrancisco"
    }),
    QueueUrl: rideMatchingIngress.url
  }
  rideMatchingSQS.sendMessage(params, (err, data) => {
    if (err) console.log(err);
    else console.log(date);
  })
}
