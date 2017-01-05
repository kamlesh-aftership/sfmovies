'use strict';

const MoviesModel = require('../models/MovieModel');

exports.getMovieByName = function (movieName) {
	return new Promise(function (resolve, reject) {
		MoviesModel.findOne({title: movieName}).exec(function (error, movie) {
			if (error) {
				reject({error: error});
			}			else {
				resolve(movie);
			}
		});
	});
};

exports.getAllMovie = function () {
	return new Promise(function (resolve, reject) {
		MoviesModel.find().exec(function (error, movies) {
			if (error) {
				reject({error: error});
			}			else {
				resolve(movies);
			}
		});
	});
};
