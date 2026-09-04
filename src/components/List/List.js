import React, {
  createRef,
  useEffect,
  useState,
} from 'react';

import {
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@material-ui/core';

import PlaceDetails from '../PlaceDetails/PlaceDetails';
import useStyles from './styles.js';

const List = ({
  places,
  type,
  setType,
  childClicked,
  isLoading,
  cityName,
}) => {
  const [elRefs, setElRefs] = useState([]);

  const classes = useStyles();

  useEffect(() => {
    setElRefs((refs) => (
      Array(places.length)
        .fill()
        .map((_, index) => (
          refs[index] || createRef()
        ))
    ));
  }, [places]);

  const location = cityName || 'your area';

  const titles = {
    restaurants: `Restaurants & Cafes in ${location}`,
    hotels: `Hotels in ${location}`,
    attractions: `Attractions in ${location}`,
  };

  return (
    <div className={classes.container}>
      <Typography
        variant="h5"
        style={{
          fontWeight: 600,
          marginBottom: '8px',
        }}
      >
        {titles[type]}
      </Typography>

      <FormControl className={classes.formControl}>
        <InputLabel id="type-label">
          Explore
        </InputLabel>

        <Select
          labelId="type-label"
          id="type"
          value={type}
          onChange={(event) => (
            setType(event.target.value)
          )}
        >
          <MenuItem value="restaurants">
            Restaurants
          </MenuItem>

          <MenuItem value="hotels">
            Hotels
          </MenuItem>

          <MenuItem value="attractions">
            Attractions
          </MenuItem>
        </Select>
      </FormControl>

      {isLoading ? (
        <div className={classes.loading}>
          <CircularProgress />

          <Typography
            variant="body2"
            color="textSecondary"
            style={{ marginTop: '14px' }}
          >
            Finding nearby places...
          </Typography>
        </div>
      ) : (
        <>
          <Typography
            variant="body2"
            color="textSecondary"
          >
            {places.length} places found
          </Typography>

          {places.length === 0 ? (
            <div
              style={{
                padding: '50px 15px',
                textAlign: 'center',
              }}
            >
              <Typography
                variant="h6"
                gutterBottom
              >
                No places found
              </Typography>

              <Typography
                variant="body2"
                color="textSecondary"
              >
                Try another city or category.
              </Typography>
            </div>
          ) : (
            <Grid
              container
              spacing={3}
              className={classes.list}
            >
              {places.map((place, index) => (
                <Grid
                  ref={elRefs[index]}
                  key={place.id || index}
                  item
                  xs={12}
                >
                  <PlaceDetails
                    selected={
                      Number(childClicked) === index
                    }
                    refProp={elRefs[index]}
                    place={place}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}
    </div>
  );
};

export default List;
