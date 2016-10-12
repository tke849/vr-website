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
 	.module('SWVR.routes', []).config(routeConfig);


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
				templateUrl: 'modules/links/links.html',
				controller: 'LinksController',
				params: {
					saber: true
				}
			})

			.state('layout.person', {
				url: '/people/:id/',
				templateUrl: 'modules/details/details.html',
				controller: 'DetailsController',
				params: {
					saber: false
				}
			})

			.state('layout.starships', {
				url: '/starships/',
				templateUrl: 'modules/links/links.html',
				controller: 'LinksController',
				params: {
					saber: true
				}
			})

			.state('layout.starship', {
				url: '/starships/:id/',
				templateUrl: 'modules/details/details.html',
				controller: 'DetailsController',
				params: {
					saber: false
				}
			})

			.state('layout.species', {
				url: '/species/',
				templateUrl: 'modules/links/links.html',
				controller: 'LinksController',
				params: {
					saber: true
				}
			})

			.state('layout.type', {
				url: '/species/:id/',
				templateUrl: 'modules/details/details.html',
				controller: 'DetailsController',
				params: {
					saber: false
				}
			})

			.state('layout.vehicles', {
				url: '/vehicles/',
				templateUrl: 'modules/links/links.html',
				controller: 'LinksController',
				params: {
					saber: true
				}
			})

			.state('layout.vehicle', {
				url: '/vehicles/:id/',
				templateUrl: 'modules/details/details.html',
				controller: 'DetailsController',
				params: {
					saber: false
				}
			})

			.state('layout.planets', {
				url: '/planets/',
				templateUrl: 'modules/links/links.html',
				controller: 'LinksController',
				params: {
					saber: true
				}
			})

			.state('layout.planet', {
				url: '/planets/:id/',
				templateUrl: 'modules/details/details.html',
				controller: 'DetailsController',
				params: {
					saber: false
				}
			})

			.state('layout.films', {
				url: '/films/',
				templateUrl: 'modules/links/links.html',
				controller: 'LinksController',
				params: {
					saber: true
				}
			})

			.state('layout.film', {
				url: '/films/:id/',
				templateUrl: 'modules/details/details.html',
				controller: 'DetailsController',
				params: {
					saber: false
				}
			})




        ;
	}


})();