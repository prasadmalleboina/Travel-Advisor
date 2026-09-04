import axios from 'axios';

const cache = new Map();
const CACHE_TIME = 5 * 60 * 1000;

const endpoints = [
  'https://overpass.private.coffee/api/interpreter',
  'https://maps.mail.ru/osm/tools/overpass/api/interpreter',
  'https://overpass-api.de/api/interpreter',
];

const buildAddress = (tags = {}) => {
  const parts = [
    tags['addr:housenumber'],
    tags['addr:street'],
    tags['addr:suburb'],
    tags['addr:city'],
    tags['addr:district'],
  ].filter(Boolean);

  return parts.join(', ');
};

const buildMainAttractionsQuery = (lat, lng) => `
  [out:json][timeout:15];
  (
    nwr(around:30000,${lat},${lng})
      ["tourism"~"^(attraction|museum|viewpoint|gallery|artwork|zoo|theme_park)$"]
      ["name"];

    nwr(around:30000,${lat},${lng})
      ["natural"="beach"]
      ["name"];

    nwr(around:20000,${lat},${lng})
      ["leisure"~"^(park|garden|nature_reserve)$"]
      ["name"];
  );
  out tags center 40;
`;

const buildLocalAttractionsQuery = (lat, lng) => `
  [out:json][timeout:15];
  (
    nwr(around:25000,${lat},${lng})
      ["historic"~"^(monument|memorial|fort|ruins|archaeological_site)$"]
      ["name"];

    nwr(around:25000,${lat},${lng})
      ["man_made"~"^(lighthouse|tower)$"]
      ["name"];

    nwr(around:25000,${lat},${lng})
      ["leisure"~"^(park|garden|nature_reserve)$"]
      ["name"];

    nwr(around:30000,${lat},${lng})
      ["natural"="beach"]
      ["name"];

    nwr(around:25000,${lat},${lng})
      ["tourism"="picnic_site"]
      ["name"];
  );
  out tags center 40;
`;
const buildQuery = (type, lat, lng) => {
  if (type === 'hotels') {
    return `
      [out:json][timeout:20];
      (
        nwr(around:8000,${lat},${lng})
          ["tourism"~"^(hotel|guest_house|motel|resort)$"]
          ["name"];
      );
      out center tags;
    `;
  }
  return `
    [out:json][timeout:20];
    (
      nwr(around:7000,${lat},${lng})
        ["amenity"~"^(restaurant|cafe|fast_food)$"]
        ["name"];
    );
    out center tags;
  `;
};

const requestOverpass = (
  query,
  endpointIndex = 0,
  lastError = null,
) => {
  if (endpointIndex >= endpoints.length) {
    return Promise.reject(
      lastError || new Error('All Overpass servers failed'),
    );
  }

  return axios
    .post(
      endpoints[endpointIndex],
      `data=${encodeURIComponent(query)}`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        timeout: 30000,
      },
    )
    .catch((error) => (
      requestOverpass(
        query,
        endpointIndex + 1,
        error,
      )
    ));
};

const formatPlaces = (elements = []) => (
  elements
    .map((element) => {
      const tags = element.tags || {};

      const latitude = element.lat
        || (element.center && element.center.lat);

      const longitude = element.lon
        || (element.center && element.center.lon);

      return {
        id: `${element.type}-${element.id}`,

        name:
          tags.name
          || tags['name:en']
          || '',

        latitude,
        longitude,

        category:
          tags.amenity
          || tags.tourism
          || tags.natural
          || tags.leisure
          || tags.historic
          || 'place',

        address: buildAddress(tags),

        phone:
          tags.phone
          || tags['contact:phone']
          || '',

        website:
          tags.website
          || tags['contact:website']
          || '',

        openingHours:
          tags.opening_hours
          || '',

        cuisine: tags.cuisine
          ? tags.cuisine
            .split(';')
            .map((name) => ({ name }))
          : [],
      };
    })
    .filter(
      (place) => (
        place.name
        && place.latitude
        && place.longitude
      ),
    )
);
const limitPlacesByDistance = (
  places,
  lat,
  lng,
  limit = 100,
) => (
  places
    .map((place) => {
      const latDiff = Number(place.latitude) - Number(lat);
      const lngDiff = Number(place.longitude) - Number(lng);

      return {
        ...place,
        distanceScore:
          (latDiff * latDiff)
          + (lngDiff * lngDiff),
      };
    })
    .sort(
      (a, b) => a.distanceScore - b.distanceScore,
    )
    .slice(0, limit)
    .map(({ distanceScore, ...place }) => place)
);

export const getPlacesData = async (
  type,
  lat,
  lng,
) => {
  if (!lat || !lng) {
    return [];
  }

  // v3 avoids previously cached empty results
  const cacheKey = [
    'v4',
    type,
    Number(lat).toFixed(2),
    Number(lng).toFixed(2),
  ].join('-');

  const cached = cache.get(cacheKey);

  if (
    cached
    && Date.now() - cached.time < CACHE_TIME
  ) {
    return cached.data;
  }

  try {
    if (type === 'attractions') {
      const mainQuery = buildMainAttractionsQuery(lat, lng);
      const localQuery = buildLocalAttractionsQuery(lat, lng);
      let mainElements = [];
      let localElements = [];

      try {
        const mainResponse = await requestOverpass(mainQuery);

        mainElements = Array.isArray(mainResponse.data.elements)
          ? mainResponse.data.elements
          : [];
      } catch (error) {
        mainElements = [];
      }

      try {
        const localResponse = await requestOverpass(localQuery);

        localElements = Array.isArray(localResponse.data.elements)
          ? localResponse.data.elements
          : [];
      } catch (error) {
        localElements = [];
      }

      const allElements = [
        ...mainElements,
        ...localElements,
      ];

      const uniqueElements = allElements.filter(
        (element, index, array) => (
          array.findIndex(
            (item) => (
              item.type === element.type
              && item.id === element.id
            ),
          ) === index
        ),
      );

      const formattedAttractions = formatPlaces(uniqueElements);

      const attractionPlaces = limitPlacesByDistance(
        formattedAttractions,
        lat,
        lng,
        100,
      );

      if (attractionPlaces.length > 0) {
        cache.set(cacheKey, {
          data: attractionPlaces,
          time: Date.now(),
        });
      }

      return attractionPlaces;
    }
    const query = buildQuery(
      type,
      lat,
      lng,
    );

    const response = await requestOverpass(query);

    const elements = (
      response.data
      && Array.isArray(response.data.elements)
    )
      ? response.data.elements
      : [];

    // Temporary debugging
    // eslint-disable-next-line no-console

    const formattedPlaces = formatPlaces(elements);

    const places = limitPlacesByDistance(
      formattedPlaces,
      lat,
      lng,
      100,
    );

    // Never cache zero results
    if (places.length > 0) {
      cache.set(cacheKey, {
        data: places,
        time: Date.now(),
      });
    }

    return places;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(
      'OVERPASS ERROR:',
      error.response
        ? error.response.status
        : 'NO STATUS',
      error.response
        ? error.response.data
        : error.message,
    );

    return [];
  }
};

export const getWeatherData = async (
  lat,
  lng,
) => {
  if (!lat || !lng) {
    return null;
  }

  try {
    const { data } = await axios.get(
      'https://api.open-meteo.com/v1/forecast',
      {
        params: {
          latitude: lat,
          longitude: lng,
          current:
            'temperature_2m,apparent_temperature,weather_code,wind_speed_10m',
          timezone: 'auto',
        },
      },
    );

    return data;
  } catch (error) {
    return null;
  }
};
