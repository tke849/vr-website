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
        .controller('FilmController', FilmController)
        .directive('filmWrapper', createFilm);

    FilmController.$inject = ['$scope', '$rootScope', '$location', 'APIService', 'AFRAME'];

    function FilmController ($scope, $rootScope, $location, APIService, AFRAME) {

        var apiEndpoint = $location.$$path;

        $scope.init = function(){

            var film;

            var filmPromise = APIService.getData(apiEndpoint);

            filmPromise.then(function(data){

                film = data;

            }, function(err){

                console.log(err);

            }).finally(function(){

                var filmInfo = [];
                var filmDetail = [];


                angular.forEach(film, function(value, key){

                    if(typeof value === 'object'){
                        filmInfo[key] = value;
                    } else {
                        filmDetail[key] = value
                    }




                });

                filmInfo.push(filmDetail);

                console.log(filmInfo);



                $scope.xyCoords(filmInfo).then(function(){

                    /** Don't set on scope till all work has been done,
                     * once on scope directive is activated **/

                    $scope.filmInfo = filmInfo;

                    var container = document.querySelector('.viewContainer');

                    var html = '';

                    for (var key in $scope.filmInfo) {

                        if ($scope.filmInfo.hasOwnProperty(key)) {

                            var object = $scope.filmInfo[key];
                            var title;
                            if(key === "0"){

                                title = object.title.toUpperCase();


                                var htmlStart = '<a-entity class="film" position="' + object.x + ' 1 ' + object.z +
                                    '" rotation="0 ' + object.rotation + ' 0">';

                                var innerHtml = '';
                                var scale = 0.5;
                                var height = scale;
                                var left = scale;
                                var count = 0;

                                for (var subKey in object) {

                                    if (object.hasOwnProperty(subKey) && subKey !== 'opening_crawl') {

                                        var subObject = object[subKey];

                                        var innerHtml = innerHtml +
                                            '<a-entity bmfont-text="text: ' + subKey + '\: '+subObject + '; color: yellow; width: 300px; fnt: fonts/DejaVu-sdf.fnt;' +
                                            'align: center;" position="'+left+' '+ height +' 0" ></a-entity>'

                                    }

                                    count++;

                                    left = left + scale;
                                    if(count > 6){
                                        left = scale;
                                        height = height + scale;
                                    }

                                }

                                var htmlEnd = '</a-entity>';

                                html = html + htmlStart + innerHtml + htmlEnd;

                            } else {

                                title = key.toUpperCase();

                                var htmlStart = '<a-entity class="film" position="' + object.x + ' 1 ' + object.z +
                                '" rotation="0 ' + object.rotation + ' 0">' +
                                    '<a-entity bmfont-text="text: ' + title + '; color: yellow; width: 300px; fnt: fonts/DejaVu-sdf.fnt; align:center;' +
                                'align: center;" position="0 -0.5 0" ></a-entity>';

                                var innerHtml = '';

                                var scale = 1;
                                var nextLine = 4;
                                var height = scale;
                                var left = -1;
                                var count = 0;

                                for (var subKey in object) {

                                    if (object.hasOwnProperty(subKey) && isNaN(object[subKey])) {

                                        var subObject = object[subKey];
                                        var imageSrc = subObject.substring(0, subObject.length - 1).replace('http://swapi.co/api','images')+'.png';

                                       var innerHtml = innerHtml +
                                           '<a-image position="'+left+' '+ height +' 0" scale="1 1 1" src="' + imageSrc + '" ></a-image>';
                                    }

                                    count++;

                                    left = left + scale;
                                    if(count === nextLine){
                                        left = -1;
                                        height = height + scale;
                                    }


                                }

                                var htmlEnd = '</a-entity>';

                                html = html + htmlStart + innerHtml + htmlEnd;

                            }


                        }
                    }



                    $(container).append(html);

                    //AFRAME.registerComponent('film', {
                    //    schema: {},
                    //
                    //
                    //    init: function () {
                    //
                    //        var el = this.el;
                    //        var matrixWorld = el.object3D.matrixWorld;
                    //        var position = new THREE.Vector3();
                    //        position.setFromMatrixPosition(matrixWorld);
                    //
                    //
                    //        var html = '';
                    //
                    //        angular.forEach($scope.filmInfo, function(value, key){
                    //
                    //            var title;
                    //            if(key = 0){
                    //                title = 'Details';
                    //            } else {
                    //                title = key;
                    //            }
                    //
                    //            html = html +
                    //                '<a-entity class="film" position="'+key['x']+' 2 '+key['z']+'" rotation="0 '+key['rotation']+' 0">'+
                    //                '<a-entity bmfont-text="text: '+title+'; color: yellow; width: 300px; fnt: fonts/DejaVu-sdf.fnt; align: center;" position="-0.75 -2 0" link="'+value.url+'" ></a-entity>'+
                    //                '</a-entity>';
                    //
                    //        });
                    //
                    //        $(el).append(html);
                    //
                    //    }
                    //});



                });

            });

        };

        $scope.init();

    }

    function createFilm($compile) {
        return {
            restrict: 'EA',
            scope: {
                film: "="
            },
            link: function (scope, element, attrs) {

                scope.scene = document.querySelector('.viewContainer');


                //var html = '';
                //
                //angular.forEach(scope.films, function(film){
                //
                //    var imageSrc = film.url.substring(0, film.url.length - 1).replace('http://swapi.co/api','images')+'.png';
                //
                //    /**
                //     * The preferred method of document.createElement() resulted in the errors from AFRAME on every element created:
                //     * Unknown property `src` for component/system `undefined` ('src' for the case of a-image)
                //     */
                //
                //    html = html +
                //        '<a-entity class="films" position="'+film.x+' 2 '+film.z+'" rotation="0 '+film.rotation+' 0">'+
                //        '<a-image src="'+imageSrc+'" scale="1.5 3 0" position="0 0 0" link="'+film.url+'"></a-image>'+
                //        '<a-entity bmfont-text="text: '+film.title+'; color: yellow; width: 300px; fnt: fonts/DejaVu-sdf.fnt; align: center;" position="-0.75 -2 0" link="'+film.url+'" ></a-entity>'+
                //        '</a-entity>';
                //
                //});

                var e =$compile(html)(scope);
                element.replaceWith(e);




            }
        };
    }

})();
