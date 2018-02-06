CREATE KEYSPACE IF NOT EXISTS rides_matched 
WITH REPLICATION = { 'class' : 'SimpleStrategy', 'replication_factor' : 3 };

USE rides_matched;

DROP TABLE IF EXISTS rides_matched.drivers;
DROP TABLE IF EXISTS rides_matched.cities;

CREATE TABLE drivers (  
  driver_id int,
  price_timestamp timestamp,
  trip_id uuid,
  city text,
  pick_up_distance float,
  ride_duration int,
  PRIMARY KEY (driver_id, price_timestamp, trip_id)
);

-- INSERT INTO drivers (  
--   driver_id,
--   price_timestamp,
--   city,
--   pick_up_distance,
--   ride_duration
-- ) VALUES (  
--   1,
--   '2018-01-30T12:01:40-08:00',
--   'San Francisco', 
--   7, 
--   12
-- );

-- INSERT INTO drivers (  
--   driver_id,  
--   price_timestamp,
--   city,
--   pick_up_distance,
--   ride_duration
-- ) VALUES (  
--   2,
--   '2018-01-28T12:01:40-08:00',
--   'San Francisco',
--   4, 
--   11
-- );

-- INSERT INTO drivers (  
--   driver_id,
--   price_timestamp,
--   city,
--   pick_up_distance,
--   ride_duration
-- ) VALUES (
--   3,
--   '2018-01-27T12:01:40-08:00',
--   'San Francisco', 
--   3, 
--   13
-- );

-- INSERT INTO drivers (  
--   driver_id,
--   price_timestamp,
--   city,
--   pick_up_distance,
--   ride_duration
-- ) VALUES (
--   4,
--   '2018-01-26T12:01:40-08:00', 
--   'San Francisco', 
--   1, 
--   16
-- );

-- INSERT INTO drivers (  
--   driver_id,
--   price_timestamp,
--   city,
--   pick_up_distance,
--   ride_duration
-- ) VALUES (  
--   1,
--   '2018-01-21T12:01:40-08:00',
--   'San Francisco', 
--   7, 
--   1
-- );