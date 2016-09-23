(function () {
    'use strict';

    /**
     *
     * @module SWVR - Films Controller
     * @description
     * Films Controller
     *
     **/

    angular.module('SWVR')
        .controller('FilmsController', FilmsController)
        .directive('filmsWrapper', createFilms);

    FilmsController.$inject = ['$scope', '$location', 'APIService'];

    function FilmsController ($scope, $location, APIService) {

        var apiEndpoint = $location.$$path;

        $scope.init = function(){

            var films;

            var filmsPromise = APIService.getData(apiEndpoint);

            filmsPromise.then(function(data){

                films = data.results;

            }, function(err){

                console.log(err);

            }).finally(function(){

                $scope.xyCoords(films).then(function(){

                    /** Don't set on scope till all work has been done,
                     * once on scope directive is activated **/

                    $scope.films = films;





                });

            });

        };

        $scope.init();

    }

    function createFilms($compile,$stateParams ) {
        return {
            restrict: 'EA',
            scope: {
                films: "="
            },
            link: function (scope, element, attrs) {

                scope.scene = document.querySelector('.viewContainer');

                console.log($stateParams.category);


                var html = '';

                angular.forEach(scope.films, function(film){

                    var imageSrc = film.url.substring(0, film.url.length - 1).replace('http://swapi.co/api','images')+'.png';
                    var link = film.url.replace('http://swapi.co/api','');

                    /**
                     * The preferred method of document.createElement() resulted in the errors from AFRAME on every element created:
                     * Unknown property `src` for component/system `undefined` ('src' for the case of a-image)
                     */

                    html = html +
                        '<a-entity class="films" position="'+film.x+' 2 '+film.z+'" rotation="0 '+film.rotation+' 0">'+
                        '<a-image src="'+imageSrc+'" scale="1.5 3 0" position="0 0 0" link="'+link+'"></a-image>'+
                        '<a-entity bmfont-text="text: '+film.title+'; color: yellow; width: 300px; fnt: fonts/DejaVu-sdf.fnt; align: center;" position="-0.75 -2 0" link="'+film.url+'" ></a-entity>'+
                        '</a-entity>';

                });

                var e =$compile(html)(scope);
                element.replaceWith(e);

                var filmsEl = document.querySelectorAll('.films');
                filmsEl.forEach(function(film) {
                    film.addEventListener('hit', function(){
                        console.log('IM HIT!!!');
                    });
                });


            }
        };
    }

})();
