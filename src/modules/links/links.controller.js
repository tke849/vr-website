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
        .controller('LinksController', LinksController)
        .directive('createLinks', createLinks);

    LinksController.$inject = ['$scope', '$rootScope', '$location', 'APIService'];

    function LinksController ($scope, $rootScope, $location, APIService) {

        var apiEndpoint = $location.$$path;

        $scope.init = function(){

            var links;

            var linksPromise = APIService.getData(apiEndpoint);

            linksPromise.then(function(data){

                links = data.results;

            }, function(err){

                console.log(err);

            }).finally(function(){

                $scope.xyCoords(links).then(function(){

                    /** Don't set on scope till all work has been done,
                     * once on scope directive is activated **/

                    $scope.links = links;

                });

            });

        };

        $scope.init();

    }

    function createLinks($compile, $rootScope, $location ) {
        return {
            restrict: 'EA',
            scope: {
                links: "="
            },
            link: function (scope, element, attrs) {

                var path = $location.$$path;

                var scale = "2 2 2";
                if(path.indexOf('films') !== -1){
                    scale = "1.5 3 0"
                }

                var html = '';

                angular.forEach(scope.links, function(item){

                    var imageSrc = item.url.substring(0, item.url.length - 1).replace('http://swapi.co/api','images')+'.png';
                    var link = item.url.replace('http://swapi.co/api','');

                    var title = item.name ? item.name : item.title;

                    /**
                     * The preferred method of document.createElement() resulted in the errors from AFRAME on every element created:
                     * Unknown property `src` for component/system `undefined` ('src' for the case of a-image)
                     */

                    html = html +
                        '<a-entity class="films" position="'+item.x+' 2 '+item.z+'" rotation="0 '+item.rotation+' 0">'+
                        '<a-image class="link" src="'+imageSrc+'" scale="'+scale+'" position="0 0 0" link="'+link+'"></a-image>'+
                        '<a-entity bmfont-text="text: '+title+'; color: yellow; width: 300px; fnt: fonts/DejaVu.fnt; align: center; opacity: 0.5" position="-0.75 -2 0" link="'+item.url+'" ></a-entity>'+
                        '</a-entity>';

                });

                var e =$compile(html)(scope);
                element.replaceWith(e);

                $rootScope.$broadcast('linksCreated');

            }
        };
    }

})();
