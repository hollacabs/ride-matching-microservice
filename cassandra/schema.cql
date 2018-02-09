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

copy drivers (driver_id, price_timestamp, trip_id, city, pick_up_distance, ride_duration) from 'driveHistoryData.csv';