import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import axios from 'axios';

import {
  CssBaseline,
  Grid,
} from '@material-ui/core';

import {
  getPlacesData,
  getWeatherData,
} from './api/travelAdvisorAPI';

import Header from './components/Header/Header';
import List from './components/List/List';
import Map from './components/Map/Map';
import Weather from './components/WeatherTemp/Weather';

const getCityName = async (lat, lng) => {
  try {
    const { data } = await axios.get(
      'https://nominatim.openstreetmap.org/reverse',
      {
        params: {
          lat,
          lon: lng,
          format: 'json',
        },
      },
    );

    const address = data.address || {};

    return (
      address.city
      || address.town
      || address.village
      || address.municipality
      || address.county
      || 'Current Location'
    );
  } catch (error) {
    return 'Current Location';
  }
};

const App = () => {
  const [type, setType] = useState('restaurants');

  const [coords, setCoords] = useState({});
  const [cityName, setCityName] = useState('');

  const [weatherData, setWeatherData] = useState(null);
  const [places, setPlaces] = useState([]);

  const [childClicked, setChildClicked] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const requestIdRef = useRef(0);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async ({ coords: { latitude, longitude } }) => {
        setCoords({
          lat: latitude,
          lng: longitude,
        });

        const locationName = await getCityName(
          latitude,
          longitude,
        );

        setCityName(locationName);
      },
      () => {
        setCoords({
          lat: 15.9047,
          lng: 80.4674,
        });

        setCityName('Bapatla');
      },
    );
  }, []);

  useEffect(() => {
    if (!coords.lat || !coords.lng) {
      return;
    }

    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;

    setIsLoading(true);
    setChildClicked(null);

    getWeatherData(
      coords.lat,
      coords.lng,
    )
      .then((data) => {
        if (requestId === requestIdRef.current) {
          setWeatherData(data);
        }
      })
      .catch(() => {
        if (requestId === requestIdRef.current) {
          setWeatherData(null);
        }
      });

    getPlacesData(
      type,
      coords.lat,
      coords.lng,
    )
      .then((data) => {
        if (requestId !== requestIdRef.current) {
          return;
        }

        setPlaces(
          Array.isArray(data)
            ? data
            : [],
        );

        setIsLoading(false);
      })
      .catch(() => {
        if (requestId !== requestIdRef.current) {
          return;
        }

        setPlaces([]);
        setIsLoading(false);
      });
  }, [type, coords.lat, coords.lng]);

  return (
    <>
      <CssBaseline />

      <Header
        setCoords={setCoords}
        setCityName={setCityName}
      />

      <Grid
        container
        spacing={2}
        style={{
          width: '100%',
          margin: 0,
        }}
      >
        <Grid
          item
          xs={12}
          md={4}
        >
          <Weather weatherData={weatherData} />

          <List
            isLoading={isLoading}
            childClicked={childClicked}
            places={places}
            type={type}
            setType={setType}
            cityName={cityName}
          />
        </Grid>

        <Grid
          item
          xs={12}
          md={8}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            paddingTop: '12px',
          }}
        >
          <Map
            setChildClicked={setChildClicked}
            coords={coords}
            places={places}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default App;
