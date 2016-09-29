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
        .controller('FilmController', FilmController);

    FilmController.$inject = ['$scope', '$location', 'APIService'];

    function FilmController ($scope, $location, APIService) {


        var apiEndpoint = $location.$$path;

        $scope.buildFrames = function(info){

            var container = document.querySelector('.viewContainer');

            var html = '';

            for (var key in info) {


                /** First block film details **/
                if (info.hasOwnProperty(key)) {

                    var object = info[key];
                    var title;
                    if(key === "0"){

                        title = object.title.toUpperCase();


                        var htmlStart = '<a-entity position="' + object.x + ' 1 ' + object.z +
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
                                    '<a-entity bmfont-text="text: ' + subKey + '\: '+subObject + '; color: yellow; width: 300px; fnt: fonts/DejaVu.fnt;' +
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

                        /** the rest are references **/

                        title = key.toUpperCase();

                        var htmlStart = '<a-entity position="' + object.x + ' 1 ' + object.z +
                            '" rotation="0 ' + object.rotation + ' 0">' +
                            '<a-entity bmfont-text="text: ' + title + '; color: yellow; width: 300px; fnt: fonts/DejaVu.fnt; align:center;' +
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

                                var string1 = subObject.substring(0, subObject.length - 1).replace('http://swapi.co/api/','');
                                var stringBreak = string1.split('/');
                                var category = stringBreak[0];
                                var id = stringBreak[1];
                                var mapCategory = $scope.titlesMap[category];
                                var title = mapCategory[id];

                                console.log(title);

                                var innerHtml = innerHtml +
                                    '<a-image title="'+title+'" position="'+left+' '+ height +' 0" scale="1 1 1" src="' + imageSrc + '" ></a-image>';
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

        };

        $scope.init = function(){

            var film;

            var filmPromise = APIService.getData(apiEndpoint);

            filmPromise.then(function(data){

                film = data;

            }, function(err){

                console.log(err);

            }).finally(function(){

                var info = [];
                var detail = [];


                angular.forEach(film, function(value, key){

                    if(typeof value === 'object' && value.length !== 0){
                        info[key] = value;
                    } else if(typeof value !== 'object') {
                        detail[key] = value
                    }

                });

                info.push(detail);


                $scope.xyCoords(info).then(function(){

                    /** Don't set on scope till all work has been done,
                     * once on scope directive is activated **/

                    $scope.filmInfo = info;


                    $scope.buildFrames($scope.filmInfo);



                });

            });

        };

        $scope.init();

    }



})();
