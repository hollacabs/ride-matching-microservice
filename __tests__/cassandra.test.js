const cassandra = require('../database/cassandra');
const helper = require('../server/helper');

describe('Cassandra Queries', () => {
  test('Queries without appropriate field formats should fail', async () => {
    let result = cassandra.insert([1, 2, 3, 4, 5, 6])
    expect(result).toMatchObject({});
  });
  test('Queries with appropriate fields should succeed', async () => {
    let result = cassandra.insert([1, helper.uuidv4(), '2018-01-30 07:05:45-08:00', 'sanFrancisco', 5.55, 6])
    expect(result).toMatchObject({});
  });
})

