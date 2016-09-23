(function () {
    'use strict';

    angular.module('SWVR')

    /**
     *
     * @module HDJWApp - Product API Base URL
     * @description
     * Config Base URL for Product API
     *
     **/


        .factory('StarWarsAPI', function(Restangular) {
            return Restangular.withConfig(function(RestangularConfigurer) {

                RestangularConfigurer.setBaseUrl('https://swapi.co/api');

            });
        })

        .factory('BingImageAPI', function(Restangular) {
            return Restangular.withConfig(function(RestangularConfigurer) {

                RestangularConfigurer.setBaseUrl('https://api.cognitive.microsoft.com/bing/v5.0/images');

            });
        })


    /**
     *
     * @module HDJWApp - Finder API Service
     * @description
     * Finder Service - service calls to return steps for the finder flow.
     *
     **/

        .service('APIService', APIService);


    APIService.$inject = ['StarWarsAPI', 'BingImageAPI', '$q'];

    function APIService(StarWarsAPI, BingImageAPI, $q) {


        return {

            /**
             *
             * @funciton getProductAttributes()
             * @description
             * Get list of available product attributes
             *
             **/

                /** TODO SEARCH **/
            //people/?search=r2




            getData: function (link) {



                var deferred = $q.defer();

                StarWarsAPI.one(link).get().then(function(response){
                    deferred.resolve(response.plain());
                });

                return deferred.promise;

            },
            getImage: function (query) {


                var deferred = $q.defer();

                BingImageAPI.one('/search?q='+query+'&count=1&size=large&imageType=photo&aspect=square').get().then(function(response){
                    deferred.resolve(response);
                });

                return deferred.promise;

            }

        };
    }

})();