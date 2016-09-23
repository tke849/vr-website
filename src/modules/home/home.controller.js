(function () {
    'use strict';

    /**
     *
     * @module SWVR - Home Controller
     * @description
     * Layout Controller - Layout wrapper controller for shared view functionality
     *
     **/

    angular.module('SWVR')
        .controller('HomeController', HomeController)
        .directive('categoryWrapper', createCategories);

    HomeController.$inject = ['$scope', '$q', '$location', 'APIService'];

    function HomeController ($scope, $q, $location, APIService) {

        var apiEndpoint = $location.$$path;

        $scope.initHome = function(){

            var categories = [];

            var startedPromise = APIService.getData(apiEndpoint);

            startedPromise.then(function(data){

                angular.forEach(data, function(value,key){
                    var item = {
                        category: key,
                        api: value,
                        image: 'images/'+key+'.png'
                    };

                    categories.push(item);

                })
            }, function(err){

                console.log(err);

            }).finally(function(){

                $scope.xyCoords(categories).then(function(){

                    /** Don't set on scope till all work has been done,
                     * once on scope directive is activated **/

                    $scope.categories = categories;

                });

            });

        };

        $scope.initHome();


    }

    function createCategories($compile) {
        return {
            restrict: 'EA',
            scope: {
                categories: "="
            },
            link: function (scope, element, attrs) {

                var html = '';

                angular.forEach(scope.categories, function(category){

                    /**
                     * The preferred method of document.createElement() resulted in the errors from AFRAME on every element created:
                     * Unknown property `src` for component/system `undefined` ('src' for the case of a-image)
                     */

                    html = html +
                        '<a-entity position="'+category.x+' 2 '+category.z+'" rotation="0 '+category.rotation+' 0">'+
                            '<a-image src="'+category.image+'" scale="2.5 2.5 2.5"  category="'+category.category+'"></a-image>'+
                        '</a-entity>';

                });

                var e =$compile(html)(scope);
                element.replaceWith(e);

            }
        };
    }

})();
