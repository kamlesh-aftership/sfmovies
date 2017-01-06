'use strict';

const app = angular.module('sfmovieApp', ['ngMaterial', 'ngMessages', 'material.svgAssetsCache']);
let map;
let markers = [];

app.config(function ($provide, $httpProvider) {
	$provide.factory('ErrorInterceptor', function ($q) {
		return {
			responseError: function (rejection) {
				alert('an error occured. Please try again after some time.');
				return $q.reject(rejection);
			}
		};
	});
	$httpProvider.interceptors.push('ErrorInterceptor');
});

app.controller('locationController', function ($scope, $log, $http) {
	const self = this;
	self.querySearch = querySearch;
	self.selectedItemChange = selectedItemChange;
	self.searchTextChange = searchTextChange;
	self.newState = newState;
	self.initialize = initialize;
	self.loadScript = loadScript;
	self.ChangeGoogleMapsLanguage = ChangeGoogleMapsLanguage;

	// api call for get all movies
	$http.get('/location').then(function (response) {
		let allStates = response.data;
		self.states = allStates.map(function (state) {
			return {
				value: state.title.toLowerCase(),
				display: state.title
			};
		});
	});

	// to handle situation when use enter invalid name which doesn't exist
	function newState(state) {
		alert('Sorry! You will need to create a Constitution for ' + state + ' first!');
	}

	// this function is used for serching keyword
	function querySearch(query) {
		let results = query ? self.states.filter(createFilterFor(query)) : self.states;
		return results;
	}

	// tracks the user input search text
	function searchTextChange(text) {
		$log.info('Text changed to ' + text);
	}

	// get movie when use enter movie name
	function selectedItemChange(item) {
		if (item !== undefined) {
			for (let i = 0; i < markers.length; i++) {
				markers[i].setMap(null);
			}
			markers = [];
			$http.get('/location/' + item.display).then(function (response) {
				for (let i = 0; i < response.data.locations.length; i++) {
					createmarker(response.data.locations[i]);
				}
			});
		}
	}

	// filter the movie name based on user input
	function createFilterFor(query) {
		let lowercaseQuery = angular.lowercase(query);
		return function filterFn(state) {
			return (state.value.indexOf(lowercaseQuery) === 0);
		};
	}

	$scope.availableLocales = {
		'en': 'English',
		'zh': 'Chinese'};
	$scope.selectedLocale = sessionStorage.getItem('lang');
});

// initializes the google map
function initialize() {
	let mapOptions = {
		zoom: 10,
		center: new google.maps.LatLng(37.774929, -122.419416)
	};
	map = new google.maps.Map(document.getElementById('map-canvas'),
                mapOptions);
	new google.maps.Marker({
		position: {lat: 37.774929, lng: -122.419416},
		map: map
	});
}

// loads the script to change google-map language based on user selection
function loadScript() {
	let newlang = sessionStorage.getItem('lang');
	let script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBvupNOEdI1LZlBmR8cIw-i3IksgyWvD6A&callback=initialize';
	if (newlang) {
		script.src += '&language=' + newlang;
	}
	script.id = 'google-maps-script';
	document.body.appendChild(script);
	sessionStorage.removeItem('lang');
}

window.onload = loadScript;

// set the language name in session and reloads the page
function ChangeGoogleMapsLanguage(language) {
	sessionStorage.setItem('lang', language);
	window.location.reload(true);
}

// create the marker to show locations on map
function createmarker(obj) {
	let marker = new google.maps.Marker({
		position: {lat: parseFloat(obj.coords.latitude), lng: parseFloat(obj.coords.longitude)},
		map: map,
		title: obj.name
	});
	markers.push(marker);
}
