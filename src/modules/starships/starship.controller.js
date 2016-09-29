(function () {
    'use strict';

    /**
     *
     * @module SWVR - Starships Controller
     * @description
     * Starships Controller
     *
     **/

    angular.module('SWVR')
        .controller('StarshipsController', StarshipsController)
        .directive('starshipsWrapper', createStarships);

    StarshipsController.$inject = ['$scope', '$location', 'APIService'];

    function StarshipsController ($scope, $location, APIService) {

        var apiEndpoint = $location.$$path;

        $scope.init = function(){

            var starships;

            var starshipsPromise = APIService.getData(apiEndpoint);

            starshipsPromise.then(function(data){

                starships = data.results;

            }, function(err){

                console.log(err);

            }).finally(function(){

                $scope.xyCoords(starships).then(function(){

                    /** Don't set on scope till all work has been done,
                     * once on scope directive is activated **/

                    $scope.starships = starships;


                });

            });

        };

        $scope.init();

    }

    function createStarships($compile) {
        return {
            restrict: 'EA',
            scope: {
                starships: "="
            },
            link: function (scope, element, attrs) {

                var html = '';

                angular.forEach(scope.starships, function(ship){

                    var imageSrc = ship.url.substring(0, ship.url.length - 1).replace('http://swapi.co/api','images')+'.png';
                    var link = ship.url.replace('http://swapi.co/api','');

                    /**
                     * The preferred method of document.createElement() resulted in the errors from AFRAME on every element created:
                     * Unknown property `src` for component/system `undefined` ('src' for the case of a-image)
                     */

                    html = html +
                        '<a-entity position="'+ship.x+' 2 '+ship.z+'" rotation="0 '+ship.rotation+' 0">'+
                        '<a-image src="'+imageSrc+'" scale="2 2 2" position="0 0 0" link="'+link+'"></a-image>'+
                        '<a-entity bmfont-text="text: '+ship.name+'; color: yellow; width: 300px; fnt: fonts/DejaVu.fnt; align: center;" position="-0.75 -1.5 0" link="'+ship.url+'"></a-entity>'+
                        '</a-entity>';

                });

                var e =$compile(html)(scope);
                element.replaceWith(e);

            }
        };
    }

})();
