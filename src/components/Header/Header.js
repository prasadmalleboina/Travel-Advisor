import React, { useState } from 'react';

import axios from 'axios';

import {
  AppBar,
  IconButton,
  InputBase,
  Snackbar,
  Toolbar,
  Tooltip,
  Typography,
} from '@material-ui/core';

import MyLocationIcon from '@material-ui/icons/MyLocation';
import SearchIcon from '@material-ui/icons/Search';

import useStyles from './styles.js';

const getLocationName = async (lat, lng) => {
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

const Header = ({
  setCoords,
  setCityName,
}) => {
  const classes = useStyles();

  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState('');

  const showMessage = (text) => {
    setMessage(text);
  };

  const handleSearch = async (event) => {
    event.preventDefault();

    if (!searchTerm.trim()) {
      showMessage('Please enter a city name');
      return;
    }

    try {
      const { data } = await axios.get(
        'https://nominatim.openstreetmap.org/search',
        {
          params: {
            q: searchTerm,
            format: 'json',
            limit: 1,
          },
        },
      );

      if (data && data.length > 0) {
        const selectedLocation = data[0];

        const lat = Number(selectedLocation.lat);
        const lng = Number(selectedLocation.lon);

        setCoords({
          lat,
          lng,
        });

        const locationName = selectedLocation.display_name
          ? selectedLocation.display_name.split(',')[0]
          : searchTerm;

        setCityName(locationName);
      } else {
        showMessage('Location not found');
      }
    } catch (error) {
      showMessage('Unable to search location');
    }
  };

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      showMessage(
        'Geolocation is not supported by your browser',
      );

      return;
    }

    navigator.geolocation.getCurrentPosition(
      async ({ coords: { latitude, longitude } }) => {
        setCoords({
          lat: latitude,
          lng: longitude,
        });

        const locationName = await getLocationName(
          latitude,
          longitude,
        );

        setCityName(locationName);
        setSearchTerm('');
      },
      () => {
        showMessage(
          'Unable to access your current location',
        );
      },
    );
  };

  const handleCloseMessage = () => {
    setMessage('');
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar className={classes.toolbar}>
          <div className={classes.brand}>
            <Typography
              variant="h5"
              className={classes.title}
            >
              Travel Advisor
            </Typography>

            <Typography
              variant="caption"
              className={classes.developer}
            >
              Developed by Prasad
            </Typography>
          </div>
          <Typography
            variant="h6"
            className={classes.title}
          >
            Explore new places
          </Typography>

          <form onSubmit={handleSearch}>
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>

              <InputBase
                placeholder="Search city..."
                value={searchTerm}
                onChange={(event) => (
                  setSearchTerm(event.target.value)
                )}
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
              />
            </div>
          </form>

          <Tooltip title="Use My Location">
            <IconButton
              color="inherit"
              onClick={handleCurrentLocation}
              aria-label="use current location"
            >
              <MyLocationIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      <Snackbar
        open={Boolean(message)}
        autoHideDuration={3000}
        onClose={handleCloseMessage}
        message={message}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
      />
    </>
  );
};

export default Header;
