'use strict';

const app = angular.module('sfmovieApp', ['ngMaterial', 'ngMessages', 'material.svgAssetsCache']);
app.controller('locationController', function ($scope, $log, $http) {
	const self = this;
	self.querySearch = querySearch;
	self.selectedItemChange = selectedItemChange;
	self.searchTextChange = searchTextChange;
	self.newState = newState;
	self.initialize = initialize;
	self.loadScript = loadScript;
	self.ChangeGoogleMapsLanguage = ChangeGoogleMapsLanguage;

	$http.get('/location').then(function (response) {
		let allStates = response.data;
		self.states = allStates.map(function (state) {
			return {
				value: state.title.toLowerCase(),
				display: state.title
			};
		});
	});

	function newState(state) {
		alert('Sorry! You will need to create a Constitution for ' + state + ' first!');
	}
	function querySearch(query) {
		let results = query ? self.states.filter(createFilterFor(query)) : self.states;
		return results;
	}

	function searchTextChange(text) {
		$log.info('Text changed to ' + text);
	} function selectedItemChange(item) {
		if (item !== undefined) {
			$http.get('/location/' + item.display).then(function (response) {
				for (let i = 0; i < response.data.locations.length; i++) {
					createmarker(response.data.locations[i]);
				}
			});
		}
	}
	function createFilterFor(query) {
		let lowercaseQuery = angular.lowercase(query);
		return function filterFn(state) {
			return (state.value.indexOf(lowercaseQuery) === 0);
		};
	}

	$scope.availableLocales = {
		'en': 'English',
		'zh': 'Chinese'};
	$scope.selectedLocale = sessionStorage.getItem("lang");
});

app.config(function ($provide, $httpProvider) {
	$provide.factory('ErrorInterceptor', function ($q) {
		return {
			responseError: function (rejection) {
				alert('an error occured. Please try again after some time.');
				console.log(rejection);
				return $q.reject(rejection);
			}
		};
	});
	$httpProvider.interceptors.push('ErrorInterceptor');
});

let map;
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

function ChangeGoogleMapsLanguage(language) {
	sessionStorage.setItem('lang', language);
	window.location.reload(true);
}

function createmarker(obj) {
	new google.maps.Marker({
		position: {lat: parseFloat(obj.coords.latitude), lng: parseFloat(obj.coords.longitude)},
		map: map,
		title: obj.name
	});
}
