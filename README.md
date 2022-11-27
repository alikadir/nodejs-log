
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

## RUN 

#### Step 4 - run the app
```shell
npm start
```

### example Requests

NOTE: jq is a lightweight and flexible command-line JSON processor.

#### Get all users
```shell
 curl http://localhost:1453/user | jq .
```

#### Get user by id 
```shell
 curl http://localhost:1453/user/292 | jq .
```

#### Post user (create)
```shell
curl http://localhost:1453/user -X POST -d '
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
curl http://localhost:1453/user/292 -X DELETE 
```

