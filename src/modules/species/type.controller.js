(function () {
    'use strict';

    /**
     *
     * @module SWVR - Species Controller
     * @description
     * Species Controller
     *
     **/

    angular.module('SWVR')
        .controller('SpeciesController', SpeciesController)
        .directive('speciesWrapper', createSpecies);

    SpeciesController.$inject = ['$scope', '$rootScope', '$location', 'APIService'];

    function SpeciesController ($scope, $rootScope, $location, APIService) {

        var apiEndpoint = $location.$$path;

        $scope.init = function(){

            var species;

            var speciesPromise = APIService.getData(apiEndpoint);

            speciesPromise.then(function(data){

                species = data.results;


            }, function(err){

                console.log(err);

            }).finally(function(){

                $scope.xyCoords(species).then(function(){

                    /** Don't set on scope till all work has been done,
                     * once on scope directive is activated **/

                    $scope.species = species;

                });

            });

        };

        $scope.init();

    }

    function createSpecies($compile) {
        return {
            restrict: 'EA',
            scope: {
                species: "="
            },
            link: function (scope, element, attrs) {

                var html = '';

                angular.forEach(scope.species, function(thisSpecies){

                    var imageSrc = thisSpecies.url.substring(0, thisSpecies.url.length - 1).replace('http://swapi.co/api','images')+'.png';

                    /**
                     * The preferred method of document.createElement() resulted in the errors from AFRAME on every element created:
                     * Unknown property `src` for component/system `undefined` ('src' for the case of a-image)
                     */

                    html = html +
                        '<a-entity position="'+thisSpecies.x+' 2 '+thisSpecies.z+'" rotation="0 '+thisSpecies.rotation+' 0">'+
                        '<a-image src="'+imageSrc+'" scale="2 2 2" position="0 0 0" link="'+thisSpecies.url+'"></a-image>'+
                        '<a-entity bmfont-text="text: '+thisSpecies.name+'; color: yellow; width: 300px; fnt: fonts/DejaVu-sdf.fnt; align: center;" position="-0.75 -1.5 0" link="'+thisSpecies.url+'"></a-entity>'+
                        '</a-entity>';

                });

                var e =$compile(html)(scope);
                element.replaceWith(e);

            }
        };
    }

})();
