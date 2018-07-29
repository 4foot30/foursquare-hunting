(function() {

    // Include configuration options (Foursquare credentials and Google
    // Geocoding API key)
    const config = require('./config.js');

    // Dependencies
    const bodyParser = require('body-parser');
    const express = require('express');
    const Faye = require('faye');
    const http = require('http');
    const request = require('request');
    const requestPromise = require('request-promise');

    // Create a new app and serve it from the public directory (i.e. files in
    // the /public directory will be what the browser displays)
    const app = express();
    app.use(express.static(__dirname + '/public'));

    // Use bodyParser so we can examine and use data sent to this script in the
    // body of any POST requests fromt he browser
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));

    // Create a new instance of Faye so we can send data between this Node app
    // and the browser. The variable is called bayeux because Faye is based on
    // the Bayeux messaging protocol (https://faye.jcoglan.com/node.html)
    const bayeux = new Faye.NodeAdapter({
        mount: '/faye',
        timeout: 45
    });

    // Create a server, connect it to Faye, and set it use use port 9999 so that
    // you can browse to it on http://localhost:9999
    const server = http.createServer(app);
    bayeux.attach(server);
    server.listen(9999);

    // Listen for POST requests going to /explore
    app.post('/explore', function(postRequest, postResponse) {

        // Call the Google Maps Geocoding API to get a latitude and longitude
        // for the place you entered. This could be done just with the "near"
        // options in the Foursquare API, but that might not result in a valid
        // set of co-ordinates
        const geocodingURL = 'https://maps.googleapis.com/maps/api/geocode/json';
        const geocodingURLString = `${geocodingURL}?sensor=true&address=${postRequest.body.location}&key=${config.googleAuth.key}`;
        request(geocodingURLString, { json: true }, (err, res, body) => {
            // Stop if this request fails
            if (err) { return console.log(err); }
            // Depending on what location/address you put in, you might get more
            // than one result back. For now, rather than showing all results
            // and letting a user choose from them, let's just choose the first
            // most obvious one (body.results[0])
            if (body.results.length) {
                // Set up the request to the Foursquare API
                const foursquareOptions = {
                    uri: 'https://api.foursquare.com/v2/search/recommendations',
                    qs: {
                        client_id: config.foursquareAuth.clientId,
                        client_secret: config.foursquareAuth.clientSecret,
                        v: '20190101',
                        ll: `${body.results[0].geometry.location.lat},${body.results[0].geometry.location.lng}`,
                        query: postRequest.body.location,
                        radius: 1610
                    },
                    headers: {
                        'User-Agent': 'Request-Promise'
                    },
                    json: true // Automatically parses the JSON string in the response
                };

                requestPromise(foursquareOptions)
                    .then(function (response) {
                        // Broadcast the POST request's command to public/js/hunting.js
                        bayeux.getClient()
                        .publish('/apiResponse', {
                            response: response
                        });
                    })
                    .catch(function (err) {
                        // API call failed...
                        console.log(err);
                    }
                );
            }
        });

        // Send a status code back to the browser, otherwise the POST request
        // looks as though it always fails
        postResponse.status(200).end();

    });

})();
