
# NodeJS Elastic and Kibana Log 

## Installation

#### Step 1 - edit environment variables
```shell
cp .env.example .env
```
NOTE: dotenv import problem because of Hoisting, -r = require 
```shell
node -r dotenv/config index.js
```


#### Step 2 - install dependencies
```shell
npm install
```

#### Step 3 - run elasticsearch and kibana 
```shell
docker-compose up
```

## Run

#### Step 4 - run the app
```shell
npm start
```

### example Requests

NOTE: jq is a lightweight and flexible command-line JSON processor.

#### Get all users
```shell
 curl http://localhost:3000/user | jq .
```

#### Get user by id 
```shell
 curl http://localhost:3000/user/292 | jq .
```

#### Post user (create)
```shell
curl http://localhost:3000/user -X POST -d '
{
  "id": 1453,
  "name": "Ali Kadir",
  "userName": "alikadir",
  "age": 35,
  "email": "alikadirbagcioglu@gmail.com",
  "birthDate": "1987-01-04T02:45:18.823Z"
}
' -H "Content-Type: application/json" | jq .
```

#### Delete user by id
```shell
curl http://localhost:3000/user/292 -X DELETE 
```

#### Write info log
```shell
curl "http://localhost:3000/log/info/?message=sample%20log" -X POST -d '
{
  "id": 1453,
  "name": "Ali Kadir",
  "userName": "alikadir",
  "age": 35,
  "email": "alikadirbagcioglu@gmail.com",
  "birthDate": "1987-01-04T02:45:18.823Z"
}
' -H "Content-Type: application/json" 
```

#### Write warn log with track_id
```shell
curl "http://localhost:3000/log/warn/?message=sample%20log%20with%20trackid" -X POST -d '
{
  "id": 1453,
  "name": "Ali Kadir",
  "userName": "alikadir",
  "age": 35,
  "email": "alikadirbagcioglu@gmail.com",
  "birthDate": "1987-01-04T02:45:18.823Z"
}
' -H "Content-Type: application/json" -H "my_track_id: 8123fc8f-0cdf-443e-bfd9-86b6c07a6e1c" 
```

## Log View

#### Step 1 - Open kibana
```shell
http://localhost:5601
```
#### Step 2 - Configure indexes
```shell
Hamburger Menu > Management > Stack Management > Kibana >Index Patterns > Create Index Pattern (logs-*)
```

#### Step 3 - View and Search Logs
```shell
Hamburger Menu > Analytics > Discover > Select Index Pattern
```

## Troubleshooting

### yellow index status

https://discuss.elastic.co/t/indices-status-shows-yellow/93918/5

```shell
curl "localhost:9200/logs-2022.11.29/_settings" -X PUT -d '
{
  "index" : {
    "number_of_replicas" : 0
  }
}
' -H "Content-Type: application/json" 
```

### Duplicate log record on Elasticsearch

this is a winston's elasticsearch transport problem

https://github.com/vanthome/winston-elasticsearch/issues/219


