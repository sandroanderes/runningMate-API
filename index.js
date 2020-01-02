/*
 * JS runningMate scripts
 *
 * Copyright (c) 2019 Sandro Anderes (https://sandroanderes.ch)
 *
 * By Sandro Anderes - https://sandroanderes.ch
 * Licensed under the MIT license.
 * #
 *
 * @link #
 * @author Sandro Anderes
 * @date 01.01.2020
 * @version 1.1.0
 */

/*************************
     Variable definition
***************************/

const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const https = require('https');
const fs = require('fs');

const app = express();
const port = 3000;

/*********************
     Configruation
**********************/

//add express json limitation
app.use(express.json({ limit: '10kb' })); 

//add CORS headers
app.use(function(req, res, next) {
     res.header("Access-Control-Allow-Origin", "https://mdev.sandroanderes.ch"); // update to match the domain you will make the request from
     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
     res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT");
     next();
});

/* //add certificate options
var options = {
    cert: fs.readFileSync( '/etc/letsencrypt/live/devapp.sandroanderes.ch/fullchain.pem' ),
    key: fs.readFileSync( '/etc/letsencrypt/live/devapp.sandroanderes.ch/privkey.pem' ),
    requestCert: false,
    rejectUnauthorized: false
}; */

app.use(cors());

//configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//configuring route
app.use('/api', require('./routes/api'));

//create Server
https.createServer({
     //add certificate options
     key: fs.readFileSync('/etc/letsencrypt/live/devapp.sandroanderes.ch/privkey.pem'),
     cert: fs.readFileSync('/etc/letsencrypt/live/devapp.sandroanderes.ch/fullchain.pem'),
     requestCert: false,
     rejectUnauthorized: false
}, app)
//add listening
.listen(port, function () {
     console.log( 'Express server listening on port ' + port );
})