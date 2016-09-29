(function () {
    'use strict';

    /**
     *
     * @module Third Party Injection - AFRAME
     * @description
     * Loads AFRAME as a module
     *
     **/
    angular.module('AFRAME',[])
        //And on the momentjs module, declare the moment service that we want
        // available as an injectable
        .factory('AFRAME', function ($window) {
            if($window.AFRAME){
                //Delete moment from window so it's not globally accessible.
                //  We can still get at it through _thirdParty however, more on why later
                $window._thirdParty = $window._thirdParty || {};
                $window._thirdParty.AFRAME = $window.AFRAME;
                try { delete $window.AFRAME; } catch (e) {$window.AFRAME = undefined;
                    /*<IE8 doesn't do delete of window vars, make undefined if delete error*/}
            }
            var AFRAME = $window._thirdParty.AFRAME;
            return AFRAME;
        });


    /**
     *
     * @module Core Components
     * @description
     * Loads Angular Modules and Third Party Modules
     *
     **/

    angular


        .module('SWVR', [
            'ngAnimate',
            'ngTouch',
            'ui.router',
            'JWVR.routes',
            'restangular',
            'AFRAME'
        ])
        .config(function ($urlRouterProvider, $locationProvider, $sceDelegateProvider, $httpProvider) {

            //var appId = ':adb88475f9a9461d865a63522dfa21c4';
            //var azureKey = btoa(appId);
            //
            //$httpProvider.defaults.headers.common['Content-Type'] = 'multipart/form-data';
            //$httpProvider.defaults.headers.common['Ocp-Apim-Subscription-Key'] = 'adb88475f9a9461d865a63522dfa21c4';

            $sceDelegateProvider.resourceUrlWhitelist([
                'self']);




        }).run(function ($rootScope, $timeout, $state, $window) {

            $rootScope.fontPath = 'fonts/font.png';

            //if (window.ezar) {
            //    ezar.initializeVideoOverlay(
            //        function() {
            //            if (ezar.hasBackCamera ()) {
            //                $("body").css ("background-color", "transparent");
            //                var camera = ezar.getBackCamera ();
            //                camera.start ();
            //            } else {
            //                //alert('no back camera access!');
            //            }
            //        },
            //        function(err) {
            //           // alert('unable to init ezar: ' + err);
            //        });
            //} else {
            //
            //    var errorCallback = function(e) {
            //        console.log('Reeeejected!', e);
            //    };
            //
            //
            //    // Not showing vendor prefixes.
            //    navigator.getUserMedia({video: true, audio: false, facingMode: "environment"}, function(localMediaStream) {
            //        var video = document.querySelector('video');
            //        video.src = window.URL.createObjectURL(localMediaStream);
            //
            //        // Note: onloadedmetadata doesn't fire in Chrome when using it with getUserMedia.
            //        // See crbug.com/110938.
            //        video.onloadedmetadata = function(e) {
            //            // Ready to go. Do some stuff.
            //        };
            //    }, errorCallback);
            //
            //}


            /**
             *
             * @function navigate()
             * @description
             * angular navigation hack
             *
             **/

            $rootScope.navigate = function (state, params) {
                $timeout(function () {
                    $state.go(state, params);
                }, 0);
            };



        }).filter('trusted', ['$sce', function ($sce) {
            return function(url) {
                return $sce.trustAsResourceUrl(url);
            };
        }]);

})();
(function () {
'use strict';



	/**
	 *
	 * @module Routes
	 * @description
	 * Loads Angular Routes
	 *
	 **/


	angular
 	.module('JWVR.routes', []).config(routeConfig);


 	function routeConfig($stateProvider) {

    	$stateProvider


			.state('layout', {
				abstract: true,
				//url: '',
	        	templateUrl: 'modules/layout/layout.html',
	        	controller: 'LayoutController'
	    	})

			.state('layout.home', {
				url: '',
				templateUrl: 'modules/home/home.html',
				controller: 'HomeController',
				params: {
					saber: true
				}
			})
			.state('layout.people', {
				url: '/people/',
				templateUrl: 'modules/people/people.html',
				controller: 'PeopleController',
				params: {
					saber: true
				}
			})

			.state('layout.person', {
				url: '/people/:id/',
				templateUrl: 'modules/people/person.html',
				controller: 'PersonController',
				params: {
					saber: false
				}
			})

			.state('layout.starships', {
				url: '/starships/',
				templateUrl: 'modules/starships/starships.html',
				controller: 'StarshipsController',
				params: {
					saber: true
				}
			})

			.state('layout.starship', {
				url: '/starships/:id/',
				templateUrl: 'modules/starships/starship.html',
				controller: 'StarshipController',
				params: {
					saber: false
				}
			})

			.state('layout.species', {
				url: '/species/',
				templateUrl: 'modules/species/species.html',
				controller: 'SpeciesController',
				params: {
					saber: true
				}
			})

			.state('layout.type', {
				url: '/species/:id/',
				templateUrl: 'modules/species/species.html',
				controller: 'SpeciesController',
				params: {
					saber: false
				}
			})

			.state('layout.vehicles', {
				url: '/vehicles/',
				templateUrl: 'modules/vehicles/vehicles.html',
				controller: 'VehiclesController',
				params: {
					saber: true
				}
			})

			.state('layout.vehicle', {
				url: '/vehicle/:id',
				templateUrl: 'modules/vehicles/vehicle.html',
				controller: 'VehicleController',
				params: {
					saber: false
				}
			})

			.state('layout.planets', {
				url: '/planets/',
				templateUrl: 'modules/planets/planets.html',
				controller: 'PlanetsController',
				params: {
					saber: true
				}
			})

			.state('layout.planet', {
				url: '/planets/:id/',
				templateUrl: 'modules/planets/planet.html',
				controller: 'PlanetController',
				params: {
					saber: false
				}
			})

			.state('layout.films', {
				url: '/films/',
				templateUrl: 'modules/films/films.html',
				controller: 'FilmsController',
				params: {
					saber: true
				}
			})

			.state('layout.film', {
				url: '/films/:id/',
				templateUrl: 'modules/films/film.html',
				controller: 'FilmController',
				params: {
					saber: false
				}
			})




        ;
	}


})();
(function () {
    'use strict';

    /**
     *
     * @module SWVR - Layout Controller
     * @description
     * Layout Controller - Layout wrapper controller for shared view functionality
     *
     **/

    angular.module('SWVR')
        .controller('LayoutController', LayoutController);

    LayoutController.$inject = ['$scope', '$rootScope', '$state', '$timeout', '$q', '$location', '$interval', 'AFRAME'];

    function LayoutController ($scope, $rootScope, $state, $timeout, $q, $location, $interval, AFRAME) {

        $scope.xyCoords = function(data){

            var deferred = $q.defer();

            var length = Object.keys(data).length;

            var eachSegment = 360/ length;
            var segmentTotal = 0;
            var viewRadius = 4;

            var itemCount = 0;

            for (var key in data){
                if (data.hasOwnProperty(key)) {

                    // x and z coordinates on the circle edge
                    var X = viewRadius * Math.sin(segmentTotal * Math.PI / 180.0);
                    var Z = viewRadius * Math.cos(segmentTotal * Math.PI / 180.0);

                    data[key].x = X;
                    data[key].z = Z;
                    data[key].rotation = segmentTotal+180;

                    segmentTotal = segmentTotal + eachSegment;

                    itemCount++;

                    if(itemCount === data.length){
                        deferred.resolve();
                    }

                }
            }

            return deferred.promise;

        };

        $scope.saberCoords = function(direction){

            var deferred = $q.defer();

            direction = direction + 180;

            var start = 1;
            var end = 4.5;

            var coords = {
                startX : start * Math.sin(direction * Math.PI / 180.0),
                startZ : start * Math.cos(direction * Math.PI / 180.0),
                endX : end * Math.sin(direction * Math.PI / 180.0),
                endZ : end * Math.cos(direction * Math.PI / 180.0)
            };

            deferred.resolve(coords);

            return deferred.promise;

        };

        $scope.viveControls = function(){

            /** vive controls **/

            var rightHand = document.querySelector('#rightHand');
            var rightSaber = document.querySelector('.rightSaber');

            rightHand.addEventListener('buttondown', function(e){
                rightSaber.emit('throwRightSaber');
                $scope.followLink(e);
            });

            var leftHand = document.querySelector('#leftHand');
            var leftSaber = document.querySelector('.leftSaber');

            leftHand.addEventListener('buttondown', function(e){
                leftSaber.emit('throwLeftSaber');
                $scope.followLink(e);
            });


            leftSaber.addEventListener('animationend', function(e){
                $scope.nextEvent(e, leftSaber);
            });

            rightSaber.addEventListener('animationend', function(e){
                $scope.nextEvent(e, rightSaber);
            });

        };


        $scope.nextEvent = function(e,saber){

            if(e.detail.target.attributes.next && e.detail.target.attributes.next.nodeValue === 'stopAnimation'){
                $scope.cameraSaberActive = false;
                $interval.cancel($scope.throwTimer);
            }

            if(e.detail.target.attributes.next){
                var nextEvent = e.detail.target.attributes.next.nodeValue;
                saber.emit(nextEvent);
            }

        };

        $scope.activeLink;

        $scope.$on('linksCreated', function(){

            var links = document.querySelectorAll('.link');

            angular.forEach(links, function(link){

                link.addEventListener('hit', function(e) {

                    if(!$scope.activeLink){

                        $scope.activeLink = true;

                        if(e.target.attributes.link){
                            var link = e.target.attributes.link.nodeValue;
                            $location.path(link);
                            $location.replace();
                        }

                        if(e.target.attributes.category){
                            var category = e.target.attributes.category.nodeValue;
                            $rootScope.navigate('layout.'+category);
                        }

                        if(e.target.attributes.back){
                            window.history.back();
                        }

                        if(e.target.attributes.forward){
                            window.history.forward();
                        }

                        if(e.target.attributes.home){
                            $rootScope.navigate('layout.home');
                        }

                    }

                    $timeout(function(){
                        $scope.activeLink = false;
                    }, 2000);

                });
            });

        });


        $scope.cameraSaberActive = false;
        $scope.throwTimer;


        $scope.cameraSaber = function(){


                $timeout(function(){

                    var cameraSaber = document.querySelector('.cameraSaber');

                    var scene = document.querySelector('a-scene');

                    scene.addEventListener('click', function(){

                        if(!$scope.cameraSaberActive){
                            $scope.cameraSaberActive = true;
                            cameraSaber.emit('throwCameraSaber');

                            var hitObject = document.querySelector('.hitCylinder');

                            $scope.throwTimer = $interval(function(){

                                $scope.tick(hitObject);

                            },100)
                        }


                    });

                    cameraSaber.addEventListener('animationend', function(e){
                        $scope.nextEvent(e,cameraSaber);
                    });

                },0);


        };

        $scope.tick = function(el){

            el.els = [];

            var targetEls = el.sceneEl.querySelectorAll('.link');
            for (var i = 0; i < targetEls.length; i++) {
                el.els.push(targetEls[i]);
            }

            el.collisions = [];
            el.elMax = new THREE.Vector3();
            el.elMin = new THREE.Vector3();

            var boundingBox = new THREE.Box3();

            var collisions = [];

            var mesh = el.getObject3D('mesh');
            var self = el;
            // No mesh, no collisions
            if (!mesh) {
                console.log('no mesh');
                return;
            }
            // Update the bounding box to account for rotations and
            // position changes.
            updateBoundingBox();

            var container = document.querySelector('.viewContainer');
            // Update collisions.
            el.els.forEach(intersect);
            // Emit events.
            collisions.forEach(handleHit);
            // No collisions.
            if (collisions.length === 0) {
                console.log('no collision');
                el.emit('hit', {el: null});
            }
            // Updated the state of the elements that are not intersected anymore.
            el.collisions.filter(function (el) {
                return collisions.indexOf(el) === -1;
            }).forEach(function removeState (el) {
                el.removeState(self.data.state);
            });
            // Store new collisions
            el.collisions = collisions;

            // AABB collision detection
            function intersect (el) {
                var intersected;
                var mesh = el.getObject3D('mesh');
                var elMin;
                var elMax;
                if (!mesh) { return; }
                boundingBox.setFromObject(mesh);
                elMin = boundingBox.min;
                elMax = boundingBox.max;
                intersected = (self.elMin.x <= elMax.x && self.elMax.x >= elMin.x) &&
                    (self.elMin.y <= elMax.y && self.elMax.y >= elMin.y) &&
                    (self.elMin.z <= elMax.z && self.elMax.z >= elMin.z);
                if (!intersected) { return; }
                collisions.push(el);
            }

            function handleHit (hitEl) {
                console.log('HIT!!!!');
                hitEl.emit('hit');
                //hitEl.addState(self.data.state);
                el.emit('hit', {el: hitEl});
            }

            function updateBoundingBox () {
                boundingBox.setFromObject(mesh);
                el.elMin.copy(boundingBox.min);
                el.elMax.copy(boundingBox.max);
            }


        };


        $scope.loadARVideo = function(){

            if (window.ezar) {
                ezar.initializeVideoOverlay(
                    function() {
                        if (ezar.hasBackCamera ()) {
                            $("body").css ("background-color", "transparent");
                            var camera = ezar.getBackCamera ();
                            camera.start ();
                        } else {
                            //alert('no back camera access!');
                        }
                    },
                    function(err) {
                        // alert('unable to init ezar: ' + err);
                    });
            } else {

                var errorCallback = function(e) {
                    console.log('Reeeejected!', e);
                };

                navigator.getUserMedia = navigator.getUserMedia ||
                    navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

                if (typeof MediaStreamTrack === 'undefined' && navigator.getUserMedia) {
                    alert('This browser doesn\'t support this demo :(');
                } else {

                    var options = {
                        video: {
                            optional: [{facingMode: "environment"}]
                        }
                    };

                    var streamFound =  function(localMediaStream) {
                        var assets = document.querySelector('a-assets');

                        var canvas = document.querySelector('canvas');
                        var ratio = canvas.height / canvas.width;
                        var depth = 5;
                        var height = ratio * ( 4 * (depth - 0.5));
                        var width =  4 * (depth - 0.5);

                        var video = document.createElement('video');
                        video.setAttribute('autoplay','true');
                        video.setAttribute('id','arVideo');

                        console.log(video.videoHeight); // returns the intrinsic height of the video
                        console.log(video.videoWidth);

                        video.src = window.URL.createObjectURL(localMediaStream);

                        // Note: onloadedmetadata doesn't fire in Chrome when using it with getUserMedia.
                        // See crbug.com/110938.
                        video.onloadedmetadata = function(e) {
                            // Ready to go. Do some stuff.
                            assets.appendChild(video);

                            var arVideo = document.createElement('a-video');
                            arVideo.setAttribute('src','#arVideo');
                            arVideo.setAttribute('height', '100%');
                            arVideo.setAttribute('width', '100%');
                            arVideo.setAttribute('position','0 2 -'+depth);

                            var camera = document.querySelector('a-camera');

                            camera.appendChild(arVideo);
                        };
                    }

                    MediaStreamTrack.getSources(function(sources) {
                        for (var i = 0; i !== sources.length; ++i) {
                            var source = sources[i];
                            if (source.kind === 'video') {
                                if (source.facing && source.facing == "environment") {
                                    options.video.optional.push({'sourceId': source.id});

                                    //navigator.getUserMedia(options, streamFound, errorCallback);
                                }
                            }
                        }
                    });

                    navigator.getUserMedia(options, streamFound, errorCallback);

                }

            }

        };


        $scope.registerSpawner = function(){

            AFRAME.registerComponent('spawner', {
                schema: {
                    on: { default: 'mousedown' },
                    mixin: { default: '' }
                },
                update: function () {


                    var el = this.el;
                    var spawn = this.spawn.bind(this);
                    if (this.on === this.data.on) { return; }
                    el.removeEventListener(this.on, spawn);
                    el.addEventListener(this.data.on, spawn);
                    this.on = this.data.on;

                },

                spawn: function () {

                    if(!$state.params.saber){

                        var el = document.querySelector('a-camera');

                        el.object3D.updateMatrixWorld();
                        var vector = new THREE.Vector3();
                        var barrel = document.querySelector('.bullet');
                        vector.setFromMatrixPosition( barrel.object3D.matrixWorld );

                        var direction = el.components.rotation.data.y;
                        direction = direction + 180;

                        var incline = el.components.rotation.data.x;
                        incline = 90 - incline;

                        var spawnWrapper = document.createElement('a-entity');
                        spawnWrapper.setAttribute('class','pew');
                        spawnWrapper.setAttribute('position', vector.x + ' ' + vector.y + ' ' + vector.z);
                        spawnWrapper.setAttribute('rotation', incline +' '+ direction +' 0');

                        var spawnPew = document.createElement('a-entity');
                        spawnPew.setAttribute('class','pewpew');
                        spawnPew.setAttribute('position', '0 .1 0');
                        spawnPew.setAttribute('rotation', '0 0 0');
                        spawnPew.setAttribute('mixin', this.data.mixin);

                        var shootPew = document.createElement('a-animation');
                        shootPew.setAttribute('attribute','position');
                        shootPew.setAttribute('easing','linear');
                        shootPew.setAttribute('to', '0 20 0');
                        shootPew.setAttribute('fill', 'forwards');
                        shootPew.setAttribute('dur', '1000');

                        spawnPew.appendChild(shootPew);
                        spawnWrapper.appendChild(spawnPew);

                        var scene = document.querySelector('a-scene');
                        scene.appendChild(spawnWrapper);

                    }




                }
            });

        };

        $scope.checkWeapon = function(){

            var cameraSaber = document.querySelector('.cameraSaber');
            var blaster  = document.querySelector('.blaster');

            if(!$state.params.saber){
                $timeout(function(){
                    cameraSaber.pause();
                    //cameraSaber.traverse( function ( object ) { object.visible = false; } );
                }, 1500)
            } else {
                //cameraSaber.traverse( function ( object ) { object.visible = true; } );
                cameraSaber.play();
            }

        };


        $scope.init = function(){



            //$scope.viveControls();

            $scope.cameraSaber();

            $scope.registerSpawner();

            //$scope.loadARVideo();

            $scope.checkWeapon();

        };

        $scope.init();





        $rootScope.$on('$stateChangeSuccess', function(){

            $scope.checkWeapon();

        })

    }





})();

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

    HomeController.$inject = ['$scope', '$rootScope', '$location', 'APIService'];

    function HomeController ($scope, $rootScope, $location, APIService) {

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

    function createCategories($compile, $rootScope) {
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
                            '<a-image class="link" src="'+category.image+'" scale="2.5 2.5 2.5"  category="'+category.category+'"></a-image>'+
                        '</a-entity>';

                });

                var e =$compile(html)(scope);
                element.replaceWith(e);

                $rootScope.$broadcast('linksCreated');


            }
        };
    }

})();

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

    PeopleController.$inject = ['$scope', '$rootScope', 'APIService'];

    function PeopleController ($scope, $rootScope, APIService) {

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

    function createPeople($compile, $rootScope) {
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
                        '<a-image class="link" src="'+imageSrc+'" scale="2 3 2" position="0 0 0" link="'+link+'"></a-image>'+
                        '<a-entity bmfont-text="text: '+person.name+'; color: yellow; width: 300px; fnt: fonts/DejaVu-sdf.fnt; align: center;" position="-0.75 -2 0" link="'+person.url+'"></a-entity>'+
                        '</a-entity>';

                });

                var e =$compile(html)(scope);
                element.replaceWith(e);

                $rootScope.$broadcast('linksCreated');

            }
        };
    }

})();

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

        function createPlanets($compile, $rootScope) {
            return {
                restrict: 'EA',
                scope: {
                    planets: "="
                },
                link: function (scope, element, attrs) {

                    var html = '';

                    angular.forEach(scope.planets, function(planet){

                        var imageSrc = planet.url.substring(0, planet.url.length - 1).replace('http://swapi.co/api','images')+'.png';
                        var link = planet.url.replace('http://swapi.co/api','');

                        /**
                         * The preferred method of document.createElement() resulted in the errors from AFRAME on every element created:
                         * Unknown property `src` for component/system `undefined` ('src' for the case of a-image)
                         */

                        html = html +
                            '<a-entity position="'+planet.x+' 2 '+planet.z+'" rotation="0 '+planet.rotation+' 0">'+
                            '<a-image  class="link" src="'+imageSrc+'" scale="2 2 2" position="0 0 0" link="'+link+'"></a-image>'+
                            '<a-entity bmfont-text="text: '+planet.name+'; color: yellow; width: 300px; fnt: fonts/DejaVu-sdf.fnt; align: center;" position="-0.75 -1.5 0" link="'+planet.url+'"></a-entity>'+
                            '</a-entity>';

                    });

                    var e =$compile(html)(scope);
                    element.replaceWith(e);

                    $rootScope.$broadcast('linksCreated');

                }
            };
        }

})();

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

    FilmsController.$inject = ['$scope', '$rootScope', '$location', 'APIService'];

    function FilmsController ($scope, $rootScope, $location, APIService) {

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

    function createFilms($compile, $rootScope ) {
        return {
            restrict: 'EA',
            scope: {
                films: "="
            },
            link: function (scope, element, attrs) {

                scope.scene = document.querySelector('.viewContainer');

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
                        '<a-image class="link" src="'+imageSrc+'" scale="1.5 3 0" position="0 0 0" link="'+link+'"></a-image>'+
                        '<a-entity bmfont-text="text: '+film.title+'; color: yellow; width: 300px; fnt: fonts/DejaVu-sdf.fnt; align: center;" position="-0.75 -2 0" link="'+film.url+'" ></a-entity>'+
                        '</a-entity>';

                });

                var e =$compile(html)(scope);
                element.replaceWith(e);

                $rootScope.$broadcast('linksCreated');

            }
        };
    }

})();

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

    function createSpecies($compile, $rootScope) {
        return {
            restrict: 'EA',
            scope: {
                species: "="
            },
            link: function (scope, element, attrs) {

                var html = '';

                angular.forEach(scope.species, function(thisSpecies){

                    var imageSrc = thisSpecies.url.substring(0, thisSpecies.url.length - 1).replace('http://swapi.co/api','images')+'.png';
                    var link = thisSpecies.url.replace('http://swapi.co/api','');

                    /**
                     * The preferred method of document.createElement() resulted in the errors from AFRAME on every element created:
                     * Unknown property `src` for component/system `undefined` ('src' for the case of a-image)
                     */

                    html = html +
                        '<a-entity position="'+thisSpecies.x+' 2 '+thisSpecies.z+'" rotation="0 '+thisSpecies.rotation+' 0">'+
                        '<a-image class="link" src="'+imageSrc+'" scale="2 2 2" position="0 0 0" link="'+link+'"></a-image>'+
                        '<a-entity bmfont-text="text: '+thisSpecies.name+'; color: yellow; width: 300px; fnt: fonts/DejaVu-sdf.fnt; align: center;" position="-0.75 -1.5 0" link="'+thisSpecies.url+'"></a-entity>'+
                        '</a-entity>';

                });

                var e =$compile(html)(scope);
                element.replaceWith(e);

                $rootScope.$broadcast('linksCreated');

            }
        };
    }

})();

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

    StarshipsController.$inject = ['$scope', '$rootScope', '$location', 'APIService'];

    function StarshipsController ($scope, $rootScope, $location, APIService) {

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

    function createStarships($compile, $rootScope) {
        return {
            restrict: 'EA',
            scope: {
                starships: "="
            },
            link: function (scope, element, attrs) {

                var html = '';

                angular.forEach(scope.starships, function(ship){

                    var imageSrc = ship.url.substring(0, ship.url.length - 1).replace('http://swapi.co/api','images')+'.png';

                    /**
                     * The preferred method of document.createElement() resulted in the errors from AFRAME on every element created:
                     * Unknown property `src` for component/system `undefined` ('src' for the case of a-image)
                     */

                    html = html +
                        '<a-entity position="'+ship.x+' 2 '+ship.z+'" rotation="0 '+ship.rotation+' 0">'+
                        '<a-image class="link" src="'+imageSrc+'" scale="2 2 2" position="0 0 0" link="'+ship.url+'"></a-image>'+
                        '<a-entity bmfont-text="text: '+ship.name+'; color: yellow; width: 300px; fnt: fonts/DejaVu-sdf.fnt; align: center;" position="-0.75 -1.5 0" link="'+ship.url+'"></a-entity>'+
                        '</a-entity>';

                });

                var e =$compile(html)(scope);
                element.replaceWith(e);

                $rootScope.$broadcast('linksCreated');

            }
        };
    }

})();

(function () {
    'use strict';

    angular.module('SWVR')

    /**
     *
     * @module HDJWApp - Product API Base URL
     * @description
     * Config Base URL for Product API
     *
     **/


        .factory('StarWarsAPI', function(Restangular) {
            return Restangular.withConfig(function(RestangularConfigurer) {

                RestangularConfigurer.setBaseUrl('https://swapi.co/api');

            });
        })

        .factory('BingImageAPI', function(Restangular) {
            return Restangular.withConfig(function(RestangularConfigurer) {

                RestangularConfigurer.setBaseUrl('https://api.cognitive.microsoft.com/bing/v5.0/images');

            });
        })


    /**
     *
     * @module HDJWApp - Finder API Service
     * @description
     * Finder Service - service calls to return steps for the finder flow.
     *
     **/

        .service('APIService', APIService);


    APIService.$inject = ['StarWarsAPI', 'BingImageAPI', '$q'];

    function APIService(StarWarsAPI, BingImageAPI, $q) {


        return {

            /**
             *
             * @funciton getProductAttributes()
             * @description
             * Get list of available product attributes
             *
             **/

                /** TODO SEARCH **/
            //people/?search=r2




            getData: function (link) {



                var deferred = $q.defer();

                StarWarsAPI.one(link).get().then(function(response){
                    deferred.resolve(response.plain());
                });

                return deferred.promise;

            },
            getImage: function (query) {


                var deferred = $q.defer();

                BingImageAPI.one('/search?q='+query+'&count=1&size=large&imageType=photo&aspect=square').get().then(function(response){
                    deferred.resolve(response);
                });

                return deferred.promise;

            }

        };
    }

})();