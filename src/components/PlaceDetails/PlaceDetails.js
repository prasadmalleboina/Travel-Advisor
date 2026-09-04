import React from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Chip,
} from '@material-ui/core';

import LocationOnIcon from '@material-ui/icons/LocationOn';
import PhoneIcon from '@material-ui/icons/Phone';
import LanguageIcon from '@material-ui/icons/Language';
import AccessTimeIcon from '@material-ui/icons/AccessTime';

import useStyles from './styles.js';

const PlaceDetails = ({ place, selected, refProp }) => {
  const classes = useStyles();

  if (selected) {
    refProp?.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }

  const category = place.category
    ? place.category.replace(/_/g, ' ')
    : 'Place';

  return (
    <Card elevation={6}>
      <CardContent>
        <Typography gutterBottom variant="h5">
          {place.name}
        </Typography>

        <Box mb={2}>
          <Chip
            size="small"
            label={category}
            className={classes.chip}
          />

          {place?.cuisine?.map(({ name }) => (
            <Chip
              key={name}
              size="small"
              label={name.replace(/_/g, ' ')}
              className={classes.chip}
            />
          ))}
        </Box>

        {place.address && (
          <Typography
            gutterBottom
            variant="body2"
            color="textSecondary"
            className={classes.subtitle}
          >
            <LocationOnIcon />
            <span>{place.address}</span>
          </Typography>
        )}

        {place.phone && (
          <Typography
            gutterBottom
            variant="body2"
            color="textSecondary"
            className={classes.subtitle}
          >
            <PhoneIcon />
            <span>{place.phone}</span>
          </Typography>
        )}

        {place.openingHours && (
          <Typography
            gutterBottom
            variant="body2"
            color="textSecondary"
            className={classes.subtitle}
          >
            <AccessTimeIcon />
            <span>{place.openingHours}</span>
          </Typography>
        )}

        {place.website && (
          <Typography
            gutterBottom
            variant="body2"
            color="textSecondary"
            className={classes.subtitle}
          >
            <LanguageIcon />
            <span>Website available</span>
          </Typography>
        )}
      </CardContent>

      {place.website && (
        <CardActions>
          <Button
            size="small"
            color="primary"
            onClick={() => window.open(place.website, '_blank')}
          >
            Visit Website
          </Button>
        </CardActions>
      )}
    </Card>
  );
};

export default PlaceDetails;
