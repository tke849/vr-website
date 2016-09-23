(function () {
    'use strict';

    /**
     *
     * @module SWVR - People Controller
     * @description
     * People Controller
     *
     **/

    angular.module('SWVR')
        .controller('PeopleController', PeopleController)
        .directive('peopleWrapper', createPeople);

    PeopleController.$inject = ['$scope', 'APIService'];

    function PeopleController ($scope, APIService) {

        var apiEndpoint = $location.$$path;

        $scope.init = function(){

            var people

            var peoplePromise = APIService.getData(apiEndpoint);

            peoplePromise.then(function(data){

                people = data.results;

            }, function(err){

                console.log(err);

            }).finally(function(){

                $scope.xyCoords(people).then(function(){

                    /** Don't set on scope till all work has been done,
                     * once on scope directive is activated **/

                    $scope.people = people;

                });

            });

        };

        $scope.init();

    }

    function createPeople($compile) {
        return {
            restrict: 'EA',
            scope: {
                people: "="
            },
            link: function (scope, element, attrs) {

                var html = '';

                angular.forEach(scope.people, function(person){

                    var imageSrc = person.url.substring(0, person.url.length - 1).replace('http://swapi.co/api','images')+'.png';
                    var link = person.url.replace('http://swapi.co/api','');

                    /**
                     * The preferred method of document.createElement() resulted in the errors from AFRAME on every element created:
                     * Unknown property `src` for component/system `undefined` ('src' for the case of a-image)
                     */

                    html = html +
                        '<a-entity position="'+person.x+' 2 '+person.z+'" rotation="0 '+person.rotation+' 0">'+
                        '<a-image src="'+imageSrc+'" scale="2 3 2" position="0 0 0" link="'+link+'"></a-image>'+
                        '<a-entity bmfont-text="text: '+person.name+'; color: yellow; width: 300px; fnt: fonts/DejaVu-sdf.fnt; align: center;" position="-0.75 -2 0" link="'+person.url+'"></a-entity>'+
                        '</a-entity>';

                });

                var e =$compile(html)(scope);
                element.replaceWith(e);

            }
        };
    }

})();
