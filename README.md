# Interactive Galaxy

A live, interactive 3D model of the Solar System and the Milky Way. Live site: **https://natsnos.github.io/galaxy/**

## What it does
- **Real-time positions.** The Sun, the planets (from NASA/JPL orbital elements), the Moon, Jupiter's moons and the comets are placed for the current moment. Earth spins using the official IAU rotation model, so day and night match reality.
- **Photo-real surfaces.** Real planet maps, plus Earth's city lights on the night side, shiny oceans, an atmosphere glow and an all-sky Milky Way photo aligned to the true galactic orientation.
- **Search anything.** Search for an address, a place or a planet. You fly there with real satellite imagery and get a Google Maps view, local time, weather and ISS passes.
- **Live data:**
  - live weather on the globe, plus weather for any place
  - earthquakes and natural events
  - aurora forecast
  - the Sun today
  - satellite positions
  - upcoming rocket launches
  - ISS pass alerts for your home
- **Sky view, events and time travel.** Sky view shows the sky above any place, and Events lists eclipses and meteor showers. You can pause, rewind or fast-forward time.
- **Shareable links.** For example `#mars`, `#iss`, `#events`, or `#place-407128n-740060w-new-york`.

## Credits
- **Planet, Sun, Saturn ring and Milky Way maps:** [Solar System Scope](https://www.solarsystemscope.com/textures/), licensed [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). The maps are based on NASA data.
- **Earth day, normal, specular, city-lights and cloud maps, and the Moon map:** from the [three.js](https://github.com/mrdoob/three.js) examples (MIT). They are based on NASA imagery.
- **Zoomed satellite imagery:** Esri World Imagery (Esri, Maxar, Earthstar Geographics).
- **Live data:**
  - NASA GIBS, SDO and EONET
  - NOAA SWPC
  - USGS
  - CelesTrak
  - Open-Meteo
  - OpenStreetMap Nominatim
  - The Space Devs (Launch Library 2)
  - Wikipedia / Wikimedia Commons
- **Libraries:** [three.js](https://threejs.org) r128 and [satellite.js](https://github.com/shashwatak/satellite-js).

Live feeds only work when the page is served over the web, for example from GitHub Pages. Opened straight from a file, it falls back to drawn textures and computed data.
