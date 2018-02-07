const { promisify } = require('util');
const coordinates = require('../coordinates');
let redis = require("redis");
let client = redis.createClient({host: 'redis'}), multi;
multi = client.multi();

client.on("error", function (err) {
  console.log("Error " + err);
});


let randomCoordinates = (city, random) => {
  return [city.longitude[0] - Math.random() * (city.longitude[0] - city.longitude[1]), city.latitude[0] - Math.random() * (city.latitude[0] - city.latitude[1])]
}

let generateRandomDrivers = (cityCoordinates) => {
  let cityArray = Object.keys(cityCoordinates);
  let coord;
  let batchSize = 10000;
  let numberBatches = 3;
  for (var a = 0; a < numberBatches; a++) {
    insertData = [];
    for (var i = 0; i < batchSize; i++) {
      coord = randomCoordinates(cityCoordinates[cityArray[Math.floor(Math.random() * cityArray.length)]]);
      coord.push(i + a * batchSize);
      multi.geoadd('locations', ...coord);
      console.log('added', i + a * batchSize);
    }
    var start = new Date().getTime();
    multi.exec(() => {
      console.log('Execution Time', new Date().getTime() - start, 'ms');
    });
  }
}

generateRandomDrivers(coordinates);