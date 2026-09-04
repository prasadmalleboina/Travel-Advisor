import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

import 'leaflet/dist/leaflet.css';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

import useStyles from './styles.js';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const Map = ({
  coords,
  places,
  setChildClicked,
}) => {
  const classes = useStyles();

  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersLayerRef = useRef(null);

  // Create the Leaflet map only once
  useEffect(() => {
    if (
      !coords
      || !coords.lat
      || !coords.lng
      || !mapContainerRef.current
      || mapRef.current
    ) {
      return undefined;
    }

    const lat = Number(coords.lat);
    const lng = Number(coords.lng);

    const map = L.map(mapContainerRef.current, {
      zoomControl: true,
      scrollWheelZoom: true,
    }).setView([lat, lng], 14);

    L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      },
    ).addTo(map);

    markersLayerRef.current = L.layerGroup().addTo(map);

    mapRef.current = map;

    // Fix map size after React renders the container
    setTimeout(() => {
      if (mapRef.current) {
        mapRef.current.invalidateSize();
      }
    }, 100);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }

      mapRef.current = null;
      markersLayerRef.current = null;
    };
  }, [coords]);

  // Move map when user searches another city/location
  useEffect(() => {
    if (
      !mapRef.current
      || !coords
      || !coords.lat
      || !coords.lng
    ) {
      return;
    }

    const lat = Number(coords.lat);
    const lng = Number(coords.lng);

    const currentCenter = mapRef.current.getCenter();

    const latDifference = Math.abs(
      currentCenter.lat - lat,
    );

    const lngDifference = Math.abs(
      currentCenter.lng - lng,
    );

    // Move only when location actually changes
    if (
      latDifference > 0.01
      || lngDifference > 0.01
    ) {
      mapRef.current.setView(
        [lat, lng],
        14,
        {
          animate: true,
        },
      );
    }
  }, [coords]);

  // Add Restaurants / Hotels / Attractions markers
  useEffect(() => {
    if (
      !mapRef.current
      || !markersLayerRef.current
    ) {
      return;
    }

    markersLayerRef.current.clearLayers();

    if (!Array.isArray(places)) {
      return;
    }

    places.forEach((place, index) => {
      const lat = Number(place.latitude);
      const lng = Number(place.longitude);

      if (
        Number.isNaN(lat)
        || Number.isNaN(lng)
        || !lat
        || !lng
      ) {
        return;
      }

      const marker = L.marker([lat, lng]);

      const placeName = place.name || 'Unknown place';

      const category = place.category
        ? place.category.replace(/_/g, ' ')
        : 'Place';

      const address = place.address
        ? `<br />${place.address}`
        : '';

      marker.bindPopup(`
        <div style="min-width: 150px;">
          <strong>${placeName}</strong>
          <br />
          <span style="text-transform: capitalize;">
            ${category}
          </span>
          ${address}
        </div>
      `);

      marker.on('click', () => {
        if (setChildClicked) {
          setChildClicked(index);
        }
      });

      marker.addTo(markersLayerRef.current);
    });
  }, [places, setChildClicked]);

  if (
    !coords
    || !coords.lat
    || !coords.lng
  ) {
    return (
      <div className={classes.mapContainer}>
        Getting your location...
      </div>
    );
  }

  return (
    <div
      ref={mapContainerRef}
      className={classes.mapContainer}
    />
  );
};

export default Map;
