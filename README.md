# 🌍 Travel Advisor

A modern Travel Advisor web application that helps users discover nearby restaurants, hotels, weather information, and locations using an interactive map.

The application supports current-location detection as well as city-based search.

## 👨‍💻 Developer

**Prasad**

## 🌐 Live Demo

You can access the deployed application here:

[Travel Advisor Live Demo](https://traveladvisor-gamma.vercel.app/)

---

## 🚀 Project Overview

Travel Advisor is a React-based web application designed to help users explore places around their current location or any searched city.

The application provides:

- Nearby Restaurants and Cafes
- Hotels and Guest Houses
- Tourist Attractions
- Current Weather Information
- Interactive Map Locations
- Dynamic City-Based Results
- Current Location Detection

Users can search for cities such as:

- Guntur
- Vijayawada
- Chennai
- Hyderabad
- Bengaluru

The map, weather information, city title, restaurants, and hotels automatically update according to the selected location.

---

## ✨ Features

### 📍 Current Location Detection

The application automatically detects the user's current location using the browser Geolocation API.

Users can also return to their current location at any time using the **Use My Location** button available in the header.

---

### 🔎 City Search

Users can search for a city using the search bar.

After searching, the application automatically updates:

- Map location
- Weather information
- Restaurants
- Hotels
- Place markers
- City name
- Location-based titles

Example:

```text
Restaurants & Cafes in Guntur
Hotels in Vijayawada
Restaurants & Cafes in Chennai
---

### 🍽️ Restaurants & Cafes

The application displays nearby food locations such as:

- Restaurants
- Cafes
- Fast-food locations

Available information may include:

- Place name
- Category
- Cuisine
- Address
- Phone number
- Opening hours
- Website

---

### 🏨 Hotels

The application displays nearby accommodation options including:

- Hotels
- Guest houses
- Motels
- Resorts

Hotel locations are displayed both in the list and on the interactive map.

---

### 🗺️ Interactive Map

The application uses **Leaflet.js with OpenStreetMap** for map visualization.

Map features include:

- Zoom in and zoom out
- Map navigation
- Individual place markers
- Marker popups
- Automatic city location changes
- Automatic movement after city search
- Location-based restaurant and hotel markers

---

### 🌤️ Weather Information

Weather information is dynamically displayed based on the current or searched location.

Weather details include:

- Current temperature
- Weather condition
- Feels-like temperature
- Wind speed

Weather information is retrieved using the **Open-Meteo API**.

---

### 📌 Dynamic Location Titles

The interface dynamically displays the currently selected city.

Examples:

```text
Restaurants & Cafes in Guntur
Hotels in Vijayawada
Restaurants & Cafes in Chennai
---

### ⚡ Nearest Place Optimization

Large cities may contain hundreds or thousands of restaurants and hotels.

To improve performance and map readability, the application displays the nearest **100 places** for large result sets.

This improves:

- Application performance
- Map readability
- Loading speed
- User experience
- Marker visibility

---

### 🔔 User-Friendly Notifications

Material UI Snackbar notifications are used instead of browser alert messages.

Notifications may appear when:

- A location cannot be found
- Search fails
- Current location cannot be accessed
- Browser geolocation is unavailable

---

### ⏳ Loading and Empty States

While places are being fetched, the application displays:

```text
Finding nearby places...
---

## 🛠️ Technologies Used

### Frontend

- React.js
- JavaScript
- HTML5
- CSS3
- Material UI

### Maps

- Leaflet.js
- OpenStreetMap

### APIs and Data Sources

- OpenStreetMap
- Overpass API
- Nominatim Geocoding API
- Open-Meteo Weather API
- Browser Geolocation API

### Libraries

- Axios
- Leaflet
- Material UI

---

## 🏗️ Application Architecture

```text
User
 │
 ▼
React Interface
 │
 ├── City Search
 │      │
 │      ▼
 │   Nominatim API
 │
 ├── Current Location
 │      │
 │      ▼
 │   Browser Geolocation API
 │
 ├── Restaurants / Hotels
 │      │
 │      ▼
 │   Overpass API
 │
 ├── Weather
 │      │
 │      ▼
 │   Open-Meteo API
 │
 └── Interactive Map
        │
        ▼
   Leaflet + OpenStreetMap
