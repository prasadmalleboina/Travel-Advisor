import React from 'react';

import {
  Card,
  CardContent,
  Typography,
} from '@material-ui/core';

import AcUnitIcon from '@material-ui/icons/AcUnit';
import CloudIcon from '@material-ui/icons/Cloud';
import WbSunnyIcon from '@material-ui/icons/WbSunny';

import useStyles from './styles.js';

const getWeatherDescription = (code) => {
  if (code === 0) return 'Clear Sky';
  if ([1, 2, 3].includes(code)) return 'Partly Cloudy';
  if ([45, 48].includes(code)) return 'Foggy';

  if (
    [51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)
  ) {
    return 'Rainy';
  }

  if ([71, 73, 75, 77, 85, 86].includes(code)) {
    return 'Snowy';
  }

  if ([95, 96, 99].includes(code)) {
    return 'Thunderstorm';
  }

  return 'Weather';
};

const getWeatherIcon = (code) => {
  if (code === 0) {
    return <WbSunnyIcon className="weather-icon" />;
  }

  if ([71, 73, 75, 77, 85, 86].includes(code)) {
    return <AcUnitIcon className="weather-icon" />;
  }

  return <CloudIcon className="weather-icon" />;
};

const Weather = ({ weatherData }) => {
  const classes = useStyles();

  if (!weatherData || !weatherData.current) {
    return null;
  }

  const {
    temperature_2m: temperature,
    apparent_temperature: feelsLike,
    wind_speed_10m: windSpeed,
    weather_code: weatherCode,
  } = weatherData.current;

  return (
    <Card
      className={classes.card}
      elevation={3}
    >
      <CardContent className={classes.content}>
        <div className={classes.main}>
          <div className={classes.icon}>
            {getWeatherIcon(weatherCode)}
          </div>

          <div>
            <Typography
              variant="h5"
              className={classes.temperature}
            >
              {temperature}°C
            </Typography>

            <Typography
              variant="body2"
              color="textSecondary"
            >
              {getWeatherDescription(weatherCode)}
            </Typography>
          </div>
        </div>

        <div className={classes.details}>
          <Typography
            variant="body2"
            color="textSecondary"
          >
            Feels {feelsLike}°C
          </Typography>

          <Typography
            variant="body2"
            color="textSecondary"
          >
            •
          </Typography>

          <Typography
            variant="body2"
            color="textSecondary"
          >
            Wind {windSpeed} km/h
          </Typography>
        </div>
      </CardContent>
    </Card>
  );
};

export default Weather;
