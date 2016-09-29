(function () {
    'use strict';

    /**
     *
     * @module SWVR - Vehicles Controller
     * @description
     * Vehicles Controller
     *
     **/

    angular.module('SWVR')
        .controller('VehiclesController', VehiclesController)
        .directive('vehiclesWrapper', createVehicles);

    VehiclesController.$inject = ['$scope', '$rootScope', '$location', 'APIService'];

    function VehiclesController ($scope, $rootScope, $location, APIService) {

        var apiEndpoint = $location.$$path;

        $scope.init = function(){

            var vehicles;

            var vehiclesPromise = APIService.getData(apiEndpoint);

            vehiclesPromise.then(function(data){

                vehicles = data.results;

            }, function(err){

                console.log(err);

            }).finally(function(){

                $scope.xyCoords(vehicles).then(function(){

                    /** Don't set on scope till all work has been done,
                     * once on scope directive is activated **/

                    $scope.vehicles = vehicles;

                });

            });

        };



        $scope.init();


    }

    function createVehicles($compile, $rootScope) {
        return {
            restrict: 'EA',
            scope: {
                vehicles: "="
            },
            link: function (scope, element, attrs) {

                var html = '';

                angular.forEach(scope.vehicles, function(vehicle){

                    var imageSrc = vehicle.url.substring(0, vehicle.url.length - 1).replace('http://swapi.co/api','images')+'.png';
                    var link = vehicle.url.replace('http://swapi.co/api','');

                    /**
                     * The preferred method of document.createElement() resulted in the errors from AFRAME on every element created:
                     * Unknown property `src` for component/system `undefined` ('src' for the case of a-image)
                     */

                    html = html +
                        '<a-entity position="'+vehicle.x+' 2 '+vehicle.z+'" rotation="0 '+vehicle.rotation+' 0">'+
                        '<a-image class="link" src="'+imageSrc+'" scale="2 2 2" position="0 0 0" link="'+link+'"></a-image>'+
                        '<a-entity bmfont-text="text: '+vehicle.name+'; color: yellow; width: 300px; fnt: fonts/DejaVu-sdf.fnt; align: center;" position="-0.75 -1.5 0" link="'+vehicle.url+'"></a-entity>'+
                        '</a-entity>';

                });

                var e =$compile(html)(scope);
                element.replaceWith(e);

                $rootScope.$broadcast('linksCreated');

            }
        };
    }

})();
