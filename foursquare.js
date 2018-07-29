(function() {

    // Include configuration options (Foursquare credentials and Google
    // Geolocation API key)
    const config = require('./config.js');

    // Dependencies
    const bodyParser = require('body-parser');
    const express = require('express');
    const Faye = require('faye');
    const http = require('http');
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
    app.post('/explore', function(request, response) {

        // Send a status code back to the browser, otherwise the POST request
        // looks as though it always fails
        response.status(200).end();

        console.log(request.body.location);

    });

})();
