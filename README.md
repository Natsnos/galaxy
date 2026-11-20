# Interactive Galaxy

A live, interactive 3D model of the Solar System and the Milky Way. Live site: **https://natsnos.github.io/galaxy/**

## What it does
- **Real-time positions.** The Sun, the planets (from NASA/JPL orbital elements), the Moon, Jupiter's moons and the comets are placed for the current moment. Earth spins using the official IAU rotation model, so day and night match reality.
- **Photo-real surfaces.** Real planet maps, plus a 4K Earth on desktop with city lights on the night side, shiny oceans and an atmosphere glow. Saturn's rings cast shadows, and an all-sky Milky Way photo is aligned to the true galactic orientation.
- **Moons and eclipses.** There are 21 major moons, including Jupiter's four (positioned with Meeus's theory) and Phobos, Enceladus, Triton and Charon. Solar eclipses put the Moon's shadow on Earth, within about 150 km of NASA's path for 2 Aug 2027. Lunar eclipses turn the Moon red.
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

- **See things move.** Glowing trails behind the planets and the Moon, and *Watch it move*: a 25-second time-lapse that suits what you're looking at. There's an optional ambient space sound.
- **Fun for kids.** *Kids mode* uses simple words and adds "Did you know?" facts, and any card can be read aloud. There's also a space passport with stamps and badges, *Me in space* (your weight and age on other worlds), a trip planner that uses real distances, a size line-up and postcards.
- **Guided stories.** Narrated adventures that fly the camera and move the clock: Tour of the planets, Why we have seasons, How eclipses work, Journey to Mars, and Our place in the galaxy.
- **Look around.** Point a phone or tablet at the sky (compass and tilt) to see the stars, planets, Moon and ISS in that direction. On a computer, drag to look around.
- **Spacecraft and quiz.** Voyager 1 and 2, New Horizons and the Parker Solar Probe, plus a kids' space quiz that earns a passport stamp.
- **Español.** Switch the interface, kids text, quiz, stories and tour to Spanish, with a Spanish read-aloud voice. Detailed fact tables stay in English.
- **Sharing.** A preview picture when the link is shared, and a Share button on phones.
- **Install as an app.** It has a home-screen icon and runs full screen. Planets and saved maps work offline, and live data returns when you reconnect.

## Keyboard
`/` search · `Space` pause · `N` back to now · `+` and `−` change speed · `Esc` close

## How the code is organised
`index.html` holds the page structure, `css/style.css` the styles, and `js/` the code. The files in `js/` load in number order and share one global scope:

| File | What it does |
|---|---|
| 01-data | Helpers and the facts for every object |
| 02-ephemeris | Real positions: planets (JPL elements), rotation (IAU), the Moon |
| 03-textures | Drawn textures, used before real maps load or offline |
| 04-scene | 3D scene, Sun, planets, belt, stars, Milky Way, Andromeda |
| 05-earth | Satellites, auroras, places and the pin |
| 06-moons-comets | Moons of every planet, comets, city lights |
| 07-sky-events | Sky view chart, eclipses and meteor showers |
| 08-live-data | Photos, Earth imagery, satellite tracking, quakes, events, weather, ISS passes |
| 09-search | Address search and the Google Maps view |
| 10-weather | Live weather layer on the globe |
| 11-realism | Photo-real maps, Earth shader, eclipse and Saturn shadows, zoom imagery |
| 12-live-extra | Sun today, live aurora, rocket launches, ISS track and alerts |
| 13-ux | Loading screen, tour, shareable links, phone layout, true distances |
| 14-state | Per-frame positions and the live rows in cards |
| 15-ui | Labels, camera, picking, the info card, controls |
| 16-loop | The animation loop (other modules hook in with `FRAME_HOOKS` / `UI_HOOKS`) |
| 17-motion | Trails, Watch it move, sounds |
| 18-kids | The Kids Pack |
| 19-app | Install-as-app and offline notices (`sw.js` is the offline cache) |
| 20-craft-quiz | Spacecraft (Voyager 1 & 2, New Horizons, Parker) and the Space quiz |
| 21-stories | Guided, narrated stories |
| 22-skyar | Look around: the sky in the direction your phone points |
| 23-share-i18n | Share button and Spanish translation (`tr()` and the `ES` dictionary) |

When you change a file that's listed in `sw.js`, bump `VERSION` there so installed copies pick up the change.

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
