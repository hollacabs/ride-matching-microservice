const redis = require('../redis/redis');

describe('Redis Driver Statistics', () => {
  test('fetchStats should return a string', async () => {
    let statsResult = await redis.fetchStats(1);
    expect(typeof statsResult[0]).toBe('string');
  });
  test('updateStats should return a promise', async () => {
    await redis.updateStats(0, ['test']);
    let statsResult = await redis.fetchStats(0);
    expect(statsResult[0]).toBe('test');
  });
})

describe('Redis Geospatial Queries', () => {
  test('Should return three properties', async () => {
    let geoRadiusResult = await redis.geoRadius([-96.000000, 41.25000], 10);
    expect(geoRadiusResult[0]).toHaveLength(3);
  });

  test('Should return a pick up distance', async () => {
    let geoRadiusResult = await redis.geoRadius([-96.000000, 41.25000], 10);
    let pickUpDistance = parseFloat(parseFloat(geoRadiusResult[0][1]).toFixed(2));
    expect(pickUpDistance).toBeGreaterThan(0);
  });

  test('Should return a distance', async () => {
    let geoRadiusResult = await redis.geoRadius([-96.000000, 41.25000], 10);
    let driverLocation = [parseFloat(geoRadiusResult[0][2][1]), parseFloat(geoRadiusResult[0][2][0])];
    expect(driverLocation[0]).toBeGreaterThan(0);
    expect(driverLocation[1]).toBeLessThan(0);
  });

  test('Removed drivers should not appear in subsequent queries', async () => {
    let geoRadiusResultOne = await redis.geoRadius([-96.000000, 41.25000], 10);
    let driverOne = geoRadiusResultOne[0][0];
    await redis.removeDriver(driverOne);
    let geoRadiusResultTwo = await redis.geoRadius([-96.000000, 41.25000], 10);
    let driverTwo = geoRadiusResultTwo[0][0];
    expect(driverOne).not.toEqual(driverTwo);
  });

  test('coordinates with no nearby drivers should return null', async () => {
    let geoRadiusResult = await redis.geoRadius([0, 0], 10);
    expect(geoRadiusResult).toHaveLength(0);
  });
})