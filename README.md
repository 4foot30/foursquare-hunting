# Foursquare hunting
Foursquare API experiment, to get interesting places to visit near to a given
location.

Takes a placename string or address that you specify and calls the [Google
Geocoding API](https://developers.google.com/maps/documentation/geocoding/intro)
to turn that place into a latitude and longitude.

Those coordinates are then fed to the
[Foursquare API](https://developer.foursquare.com/docs/api/getting-started),
which returns recommended venues within about a mile of that point.

## Set-up

- Clone this repository
- Install [Node](https://nodejs.org/en/download/) and [NPM](https://www.npmjs.com/),
v8.11.3 and v6.2.0 respectively. Specific versions shouldn't matter too much though
- Run `npm install` in your terminal, from the project root, to install the
  project's dependencies
- [Create an app with the Foursquare API](https://foursquare.com/developers/apps)
- Paste the Client ID and Client Secret you get from that into
  [config.js](config.js)
- [Get a key for the Google Geocoding API](https://developers.google.com/maps/documentation/geocoding/get-api-key)
  and again, paste that into [config.js](config.js)
- Run `gulp` in your terminal to compile the project's assets and watch for changes
- Run `node foursquare.js` in another terminal tab (or use [Nodemon](https://nodemon.io/) to watch for
  changes if you're developing)
- Open your browser and go to [localhost:9999](http://localhost:9999)

![Screenshot](/docs/screenshot_v1.png)

## Tech

- This is a publish/subscribe Node app using [Express.js](https://expressjs.com/)
  and [Faye.js](https://faye.jcoglan.com/)
- [Bootstrap](https://getbootstrap.com/docs/3.3/)'s CSS is included for basic
  form styling and layout
- [Sass](https://sass-lang.com/) is used, then compiled and minified down to
  CSS using [Gulp](https://gulpjs.com/)
- Some [ES6 JavaScript](http://es6-features.org) is used. It's transpiled down
  for older browsers using [Babel](https://babeljs.io/)

## Things to do

- At the moment, the API only shows the first 30 results. Add UI and API-call
  pagination, so the user can sequentially load all the results
- Place look-up can return more than one option. Give the user a way to see these
  options, and choose between them
- More robust error handling. Errors are logged, but there isn't much other feedback
- Remove Bootstrap's CSS and write simple "vanilla" CSS to achieve this layout
- Do something more interesting with the results, right now they're only showing
  a venue's name and photo. Plotting them on a map might be nice...
