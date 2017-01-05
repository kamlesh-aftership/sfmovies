'use strict';

const mongoose = require('mongoose');

const Movies = new mongoose.Schema({
	title: {type: String},
	release_year: {type: String},
	locations: [],
	fun_facts: {type: String},
	production_company: {type: String},
	distributor: {type: String},
	director: {type: String},
	write: {type: String},
	actor_1: {type: String},
	actor_2: {type: String},
	actor_3: {type: String},
	latitude: {type: String},
	longitude: {type: String}
});

module.exports = mongoose.model('moviesModel', Movies);
