(function () {
'use strict';



	/**
	 *
	 * @module Routes
	 * @description
	 * Loads Angular Routes
	 *
	 **/


	angular
 	.module('JWVR.routes', []).config(routeConfig);


 	function routeConfig($stateProvider) {

    	$stateProvider


			.state('layout', {
				abstract: true,
				//url: '',
	        	templateUrl: 'modules/layout/layout.html',
	        	controller: 'LayoutController'
	    	})

			.state('layout.home', {
				url: '',
				templateUrl: 'modules/home/home.html',
				controller: 'HomeController',
				params: {
					saber: true
				}
			})
			.state('layout.people', {
				url: '/people/',
				templateUrl: 'modules/people/people.html',
				controller: 'PeopleController',
				params: {
					saber: true
				}
			})

			.state('layout.person', {
				url: '/people/:id/',
				templateUrl: 'modules/people/person.html',
				controller: 'PersonController',
				params: {
					saber: false
				}
			})

			.state('layout.starships', {
				url: '/starships/',
				templateUrl: 'modules/starships/starships.html',
				controller: 'StarshipsController',
				params: {
					saber: true
				}
			})

			.state('layout.starship', {
				url: '/starships/:id/',
				templateUrl: 'modules/starships/starship.html',
				controller: 'StarshipController',
				params: {
					saber: false
				}
			})

			.state('layout.species', {
				url: '/species/',
				templateUrl: 'modules/species/species.html',
				controller: 'SpeciesController',
				params: {
					saber: true
				}
			})

			.state('layout.type', {
				url: '/species/:id/',
				templateUrl: 'modules/species/species.html',
				controller: 'SpeciesController',
				params: {
					saber: false
				}
			})

			.state('layout.vehicles', {
				url: '/vehicles/',
				templateUrl: 'modules/vehicles/vehicles.html',
				controller: 'VehiclesController',
				params: {
					saber: true
				}
			})

			.state('layout.vehicle', {
				url: '/vehicle/:id',
				templateUrl: 'modules/vehicles/vehicle.html',
				controller: 'VehicleController',
				params: {
					saber: false
				}
			})

			.state('layout.planets', {
				url: '/planets/',
				templateUrl: 'modules/planets/planets.html',
				controller: 'PlanetsController',
				params: {
					saber: true
				}
			})

			.state('layout.planet', {
				url: '/planets/:id/',
				templateUrl: 'modules/planets/planet.html',
				controller: 'PlanetController',
				params: {
					saber: false
				}
			})

			.state('layout.films', {
				url: '/films/',
				templateUrl: 'modules/films/films.html',
				controller: 'FilmsController',
				params: {
					saber: true
				}
			})

			.state('layout.film', {
				url: '/films/:id/',
				templateUrl: 'modules/films/film.html',
				controller: 'FilmController',
				params: {
					saber: false
				}
			})




        ;
	}


})();