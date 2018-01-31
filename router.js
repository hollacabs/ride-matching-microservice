const Router = require('koa-router');
const router = new Router();
const redis = require('./database/redis');
const cassandra = require('./database/cassandra');
const coordinates = require('./coordinates');

router
  .post('/', async (ctx) => {
    let body = ctx.request.body;
    try {
      let geoRadiusResult = await redis.geoRadius2km(body);
      // if no results, retry with larger radius
      if (!geoRadiusResult.length) {
        geoRadiusResult = await redis.geoRadius10km(body);
      }
      let driverId = geoRadiusResult[0][0];
      let pickUpDistance = geoRadiusResult[0][1];
      // deletes the select driver from redis
      redis.removeDriver(driverId);
      let dbEntry = [driverId, body.priceTimestamp, CITY, pickUpDistance, ]
      //driver_id, price_timestamp, city, pick_up_distance, ride_duration
      // write to cassandra
      // send to driver
      // respond to user
      ctx.response.status = 201;
    } catch(error) {
      console.log('error', error);
      ctx.response.status = 500;
    }

  })

module.exports = router;