(function () {
    'use strict';

    /**
     *
     * @module SWVR - Planets Controller
     * @description
     * Planets Controller
     *
     **/

    angular.module('SWVR')
        .controller('PlanetsController', PlanetsController)
        .directive('planetsWrapper', createPlanets);

    PlanetsController.$inject = ['$scope', '$rootScope', '$location', 'APIService'];

    function PlanetsController ($scope, $rootScope, $location, APIService) {

        var apiEndpoint = $location.$$path;

        $scope.init = function(){

            var planets;

            var planetsPromise = APIService.getData(apiEndpoint);

            planetsPromise.then(function(data){

                planets = data.results;

            }, function(err){

                console.log(err);

            }).finally(function(){

                $scope.xyCoords(planets).then(function(){

                    /** Don't set on scope till all work has been done,
                     * once on scope directive is activated **/

                    $scope.planets = planets;

                });

            });

        };

        $scope.init();

    }

        function createPlanets($compile) {
            return {
                restrict: 'EA',
                scope: {
                    planets: "="
                },
                link: function (scope, element, attrs) {

                    var html = '';

                    angular.forEach(scope.planets, function(planet){

                        var imageSrc = planet.url.substring(0, planet.url.length - 1).replace('http://swapi.co/api','images')+'.png';

                        /**
                         * The preferred method of document.createElement() resulted in the errors from AFRAME on every element created:
                         * Unknown property `src` for component/system `undefined` ('src' for the case of a-image)
                         */

                        html = html +
                            '<a-entity position="'+planet.x+' 2 '+planet.z+'" rotation="0 '+planet.rotation+' 0">'+
                            '<a-image src="'+imageSrc+'" scale="2 2 2" position="0 0 0" link="'+planet.url+'"></a-image>'+
                            '<a-entity bmfont-text="text: '+planet.name+'; color: yellow; width: 300px; fnt: fonts/DejaVu-sdf.fnt; align: center;" position="-0.75 -1.5 0" link="'+planet.url+'"></a-entity>'+
                            '</a-entity>';

                    });

                    var e =$compile(html)(scope);
                    element.replaceWith(e);

                }
            };
        }

})();
