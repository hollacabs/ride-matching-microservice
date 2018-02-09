const cassandra = require('../cassandra/cassandra');

describe('Cassandra Queries', () => {
  test('Queries without appropriate field formats should fail', async () => {
    cassandra.insert([1, 2, 3, 4, 5, 6])
      .then((result) => {
        expect(result).toBeUndefined();
      })
      .catch((err) => {
        console.log('hello', err)
        expect(err).toBeDefined();
      })
  });
  
  test('Queries with appropriate fields should succeed', async () => {
    let result = cassandra.insert([1, '27b1dd68-8e6e-400a-abdf-9acfe0196267', '2018-01-30 07:05:45-08:00', 'sanFrancisco', 5.55, 6])
    expect(result).toMatchObject({});
  });
})

