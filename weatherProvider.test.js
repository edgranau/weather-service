import axios from 'axios';
import { parseOpenWeatherMapData, parseWeatherStackData, getOpenWeatherMapData, getWeatherStackData } from './weatherProviders.js';

jest.mock('axios');

describe('weatherProviders', () => {
  const openWeatherMapResponse = {
    data: {
      'coord': {
        'lon': 144.9633,
        'lat': -37.814
      },
      'weather': [
        {
          'id': 802,
          'main': 'Clouds',
          'description': 'scattered clouds',
          'icon': '03d'
        }
      ],
      'base': 'stations',
      'main': {
        'temp': 21.98,
        'feels_like': 21.72,
        'temp_min': 20.53,
        'temp_max': 24.45,
        'pressure': 1018,
        'humidity': 57
      },
      'visibility': 10000,
      'wind': {
        'speed': 6.69,
        'deg': 190
      },
      'clouds': {
        'all': 40
      },
      'dt': 1706676764,
      'sys': {
        'type': 2,
        'id': 2008797,
        'country': 'AU',
        'sunrise': 1706643096,
        'sunset': 1706693705
      },
      'timezone': 39600,
      'id': 2158177,
      'name': 'Melbourne',
      'cod': 200
    }
  };
  const openWeatherMapExpectedResult = {
    wind_speed: 24.084000000000003,
    temperature_degrees: 21.98
  };
  const weatherStackResponse = {
    data: {
      'request': {
        'type': 'City',
        'query': 'Melbourne, Australia',
        'language': 'en',
        'unit': 'm'
      },
      'location': {
        'name': 'Melbourne',
        'country': 'Australia',
        'region': 'Victoria',
        'lat': '-37.817',
        'lon': '144.967',
        'timezone_id': 'Australia/Melbourne',
        'localtime': '2024-01-31 15:54',
        'localtime_epoch': 1706716440,
        'utc_offset': '11.0'
      },
      'current': {
        'observation_time': '04:54 AM',
        'temperature': 21,
        'weather_code': 116,
        'weather_icons': [
          'https://cdn.worldweatheronline.com/images/wsymbols01_png_64/wsymbol_0002_sunny_intervals.png'
        ],
        'weather_descriptions': [
          'Partly cloudy'
        ],
        'wind_speed': 24,
        'wind_degree': 190,
        'wind_dir': 'S',
        'pressure': 1017,
        'precip': 0,
        'humidity': 53,
        'cloudcover': 50,
        'feelslike': 21,
        'uv_index': 9,
        'visibility': 10,
        'is_day': 'yes'
      }
    }
  };
  const weatherStackExpectedResult = {
    wind_speed: 24,
    temperature_degrees: 21
  };

  it('parses OpenWeatherMap response', () => {
    expect(parseOpenWeatherMapData(openWeatherMapResponse)).toEqual(openWeatherMapExpectedResult);
  });

  it('parses WeatherStack response', () => {
    expect(parseWeatherStackData(weatherStackResponse)).toEqual(weatherStackExpectedResult);
  });

  it('should fetch OpenWeatherMap data', async() => {
    axios.get.mockResolvedValue(openWeatherMapResponse);
    const response = await getOpenWeatherMapData('Melbourne');
    expect(response).toEqual(openWeatherMapExpectedResult);
  });

  it('should fetch WeatherStack data', async() => {
    axios.get.mockResolvedValue(weatherStackResponse);
    const response = await getWeatherStackData('Melbourne');
    expect(response).toEqual(weatherStackExpectedResult);
  });

});
