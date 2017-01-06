'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/sfmovies');

const app = express();
const route = require('./config/routes');

app.use('/sfmovies', express.static(__dirname + '/assets'));
app.use(bodyParser.json());

// api call for get movie by name
app.get('/location/:name', function (req, res) {
	let promise = route.getMovieByName(req.params.name);
	promise.then(function (data) {
		res.json(data);
	},
	function (error) {
		res.status(500).send({error: error});
	});
});

// api call for get all movie
app.get('/location', function (req, res) {
	let promise = route.getAllMovie();
	promise.then(function (data) {
		res.send(data);
	},
	function (error) {
		res.status(500).send({error: error});
	});
});

app.listen('8081');
console.log('Server started on port 8081');
exports = module.exports = app;
