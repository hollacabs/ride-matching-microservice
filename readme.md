# Hollacabs - Ride Matching Service
Match ride requests to the nearest available driver. Designed for maximal efficiency and RPS. 

### Tech Stack:
- Node
- Koa
- Cassandra
- Redis
- Docker Compose
- AWS ELB, ECS, EC2, SQS
- Jest

## Architecture

![architecture diagram](https://i.imgur.com/L9SG4Nx.png)


## Data Flow

### /ridematching endpoint
Koa Server ingests client ridematching requests from AWS SQS ingress queue via long polling. Server uses Redis Geo Set queries to locate the nearest available driver. Server performs reconciliations to verify that the driver has not been assigned by another server in the fleet, and reselects a new driver if necessary. Completed requests are sent to the egress queue for client ingestion and logged in Cassandra.

### /driverstatistics endpoint
A background worker refreshes drive history data in Redis Lists (limit 10) on a 10 minute basis (10% drivers / minute). Koa Server ingests client driverstatistic requests from the AWS SQS ingress queue via long polling. Server queries Redis List and sends latest 10 trips to the egress queue for client ingestion. 

## Contributing

1. Fork it (<https://github.com/wongal5/ride-matching-microservice>)
2. Create your feature branch (`git checkout -b feature/fooBar`)
3. Commit your changes (`git commit -am 'Add some fooBar'`)
4. Push to the branch (`git push origin feature/fooBar`)
5. Create a new Pull Request
