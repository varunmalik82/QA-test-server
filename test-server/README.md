
## Set up
install the latest node js
Once you have downloaded or cloned the repo you need to install the dependencies for the API. We do this using `npm`.

```cli
npm install
```


## Start the Server

```cli
if OS is windows 
npm run windows

or

if OS is mac
npm run mac
```

## Routes

### Health Check and APIKey Test

**GET** `http://localhost:3000/`

This base route can be used to check if the API is currently running. If the server is running there should always be a response.

However, it will check for a valid API key too. The value of the key is `testApiKey`. It needs to be sent from the client as a value for an `x-api-key` header.

The successful response will be:

```json
{
  "STATUS": "Valid key"
}
```

A response for an invalid key will be:

```json
{
  "error": {
    "message": "Invalid API key"
  }
}
```

This is the only route in the API that looks for this `x-api-key` header.

### Register a user

**POST** `http://localhost:3000/api/users/register`

Body of **request** must be JSON. Sample:

```json
{
  "email": "aaa@aaa.com",
  "password": "123456"
}
```

### Login and get a token

**POST** `http://localhost:3000/api/users/tokens`

Body of **request** must be JSON. Sample:

```json
{
  "email": "aaa@aaa.com",
  "password": "123456"
}
```

Valid request will return a JSON string **response** like this sample:

```json
{
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOjE2MTM2OTIzODI4MzgsImlhdCI6MTYxMzY5MjQ4MH0.Bb0POv7eUz3q0-KwjhsIce7Bdk8CR0kW1BQ9p3B87Vs"
  }
}
```

### Get list of all giftcards

No body required. Authorization Bearer token required in the headers. Will return list of all giftcards for the current user based on the id in the signed token.

**GET** `http://localhost:3000/api/giftcards`

Sample **Response**:

```json
{
  "data": [
    {
      "_id": 1,
      "title": "Alien",
      "amount": 1000,
      "vendor": "bestbuy"
    }
  ]
}
```

### Get a specific giftcard

No body required. Authorization Bearer token required in the headers. Will get details of specific giftcard for current user, based on the token.

**GET** `http://localhost:3000/api/giftcards/:id`

Sample **response**:

```json
{
  "data": {
    "_id": 1,
    "amount": 1000,
    "vendor": "bestbuy"
  }
}
```

### Add a new giftcard

Body must be JSON. Authorization Bearer token required in the headers. Adds a new giftcard for the current user. User id comes from the token. Sample:

```json
{
  "title": "Some giftcard name",
  "year": 1999
}
```

**POST** `http://localhost:3000/api/giftcards`

**Response** will have the same data, plus an \_id property.

```json
{
  "data": {
    "_id": 2,
    "vendor": "bestbuy",
    "amount": 2000
  }
}
```

### Delete a giftcard

No body required. Authorization Bearer token required in the headers. giftcard id will come from the URL. The owner of the giftcard must match the user id in the token.

**DELETE** `http://localhost:3000/api/giftcards/:id`

**Response** for the delete will just be the id for the deleted giftcard

```json
{
  "data": { "_id": 2 }
}
```

## Error Responses

All the errors from the server should return as valid JSON data. They will have an HTTP status code of 400. They will have the same data structure in the JSON which includes `code` and `message` properties. Sample:

```json
{
  "error": {
    "code": 111,
    "message": "something went wrong"
  }
}
```

## Tokens

API uses JSON web tokens to authenticate users. The token must be included as a `Authentication` header in the request with the value set to `Bearer` followed by the token string.

Example header:

```js
"Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOjE2MTM2OTIzODI4MzgsImlhdCI6MTYxMzY5MjQ4MH0.Bb0POv7eUz3q0-KwjhsIce7Bdk8CR0kW1BQ9p3B87Vs"
```
