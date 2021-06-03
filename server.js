'use strict';

//import all packages that we need
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const axios = require('axios');
const mongoose = require('mongoose');

//save all methodes inside express 
const server = express();
//open backend server to recieve all requests
server.use(cors());

//parse any requested data by axios.post
server.use(express.json());

//define the port of this backend server
const PORT = process.env.PORT;

//start listining on this port, be ready to recieve any request
server.listen(PORT, () => {
    console.log(`I\'m listening on PORT ${PORT}`);
});


//get this request if the route was '/'
server.get('/', proofOfLif);
function proofOfLif(req, res) {
    console.log('home server route');
    let x = 'home server route';
    res.send(x);
}

//connect mongo with express server locally
mongoose.connect('mongodb://localhost:27017/books',
    { useNewUrlParser: true, useUnifiedTopology: true });
