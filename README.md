# weather-service

> HTTP Service that reports on Melbourne weather

## Introduction

The purpose of this test is for you to demonstrate your strengths. This is the first time we are seeing your code, so naturally, we would like to get some insight into how you approach solving problems. The challenge below can be implemented in an hour or two or can be done over a number of days - the amount of effort put in is up to you.

What we are looking for

- Clean, readable, reusable and maintainable code
- The use of best coding practices and modern approaches
- Test coverage and approach to writing tests
- Ease of running code locally
- Trade-offs you might have made, anything you left out, or what you might do differently if you were to spend additional time on the task.

## Task

Create an HTTP Service that reports on Melbourne weather. This service will source its information from either of the below providers:

- Weatherstack (primary):

  ```sh
  curl "http://api.weatherstack.com/current?access_key=YOUR_ACCESS_KEY&query=Melbourne"
  ```

  [Documentation](https://weatherstack.com/documentation)

- OpenWeatherMap (failover):

  ```sh
  curl "http://api.openweathermap.org/data/2.5/weather?q=melbourne,AU&appid=YOUR_APP_ID"
  ```

  [Documentation](https://openweathermap.org/current)

## Specs

- The service can hard-code Melbourne as a city.
- The service should return a JSON payload with a unified response containing temperature in degrees Celsius and wind speed.
- If one of the providers goes down, your service can quickly failover to a different provider without affecting your customers.
- Have scalability and reliability in mind when designing the solution.
- Weather results are fine to be cached for up to 3 seconds on the server in normal behaviour to prevent hitting weather providers.
- Cached results should be served if all weather providers are down.
- The proposed solution should allow new developers to make changes to the code safely.

## Expected Output

Calling the service via curl ( `http://localhost:8080/v1/weather?city=melbourne`) should output the following JSON payload.

```json
{
  "wind_speed": 20,
  "temperature_degrees": 29
}
```

## How to submit

- Working code and instructions provided as zip or hosted on Github
- Running code hosted or instructions to build and run locally provided.

## Solution

My solution is composed of two parts:

- An `express` app that:
  - exposes the `/v1/weather` endpoint
  - handles the calls to the 3rd party weather services
  - uses a `redis` client to cache the results
- A `redis` server that handles the data caching

The `express` application and `redis` server are coordinated via `docker-compose`.

## How To



### Run it

```sh
# Run the service in the background
docker-compose up --build -V -d

# Call the service
curl -fSsL http://localhost:3000/v1/weather?city=melbourne | jq
{
  "wind_speed": 26,
  "temperature_degrees": 21
}
```

### Test it

```sh
npm test
```
