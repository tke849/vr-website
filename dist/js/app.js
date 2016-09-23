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
				controller: 'HomeController'
			})
			.state('layout.people', {
				url: '/people/',
				templateUrl: 'modules/people/people.html',
				controller: 'PeopleController'
			})

			.state('layout.person', {
				url: '/people/:id/',
				templateUrl: 'modules/people/person.html',
				controller: 'PersonController'
			})

			.state('layout.starships', {
				url: '/starships/',
				templateUrl: 'modules/starships/starships.html',
				controller: 'StarshipsController'
			})

			.state('layout.starship', {
				url: '/starships/:id/',
				templateUrl: 'modules/starships/starship.html',
				controller: 'StarshipController'
			})

			.state('layout.species', {
				url: '/species/',
				templateUrl: 'modules/species/species.html',
				controller: 'SpeciesController'
			})

			.state('layout.type', {
				url: '/species/:id/',
				templateUrl: 'modules/species/species.html',
				controller: 'SpeciesController'
			})

			.state('layout.vehicles', {
				url: '/vehicles/',
				templateUrl: 'modules/vehicles/vehicles.html',
				controller: 'VehiclesController'
			})

			.state('layout.vehicle', {
				url: '/vehicle/:id',
				templateUrl: 'modules/vehicles/vehicle.html',
				controller: 'VehicleController'
			})

			.state('layout.planets', {
				url: '/planets/',
				templateUrl: 'modules/planets/planets.html',
				controller: 'PlanetsController'
			})

			.state('layout.planet', {
				url: '/planets/:id/',
				templateUrl: 'modules/planets/planet.html',
				controller: 'PlanetController'
			})

			.state('layout.films', {
				url: '/films/',
				templateUrl: 'modules/films/films.html',
				controller: 'FilmsController'
			})

			.state('layout.film', {
				url: '/films/:id/',
				templateUrl: 'modules/films/film.html',
				controller: 'FilmController'
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

    LayoutController.$inject = ['$scope', '$rootScope',  '$timeout', '$q', '$location', '$interval', 'AFRAME'];

    function LayoutController ($scope, $rootScope, $timeout, $q, $location, $interval, AFRAME) {

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

            //angular.forEach(data, function(value,key){
            //
            //    // x and z coordinates on the circle edge
            //    var X = viewRadius * Math.sin(segmentTotal * Math.PI / 180.0);
            //    var Z = viewRadius * Math.cos(segmentTotal * Math.PI / 180.0);
            //
            //    data[key].x = X;
            //    data[key].z = Z;
            //    data[key].rotation = segmentTotal+180;
            //
            //    segmentTotal = segmentTotal + eachSegment;
            //
            //    itemCount++;
            //
            //    if(itemCount === data.length){
            //        deferred.resolve();
            //    }
            //
            //});

            //for(var i = 0; i < data.length; i++){
            //
            //    // x and z coordinates on the circle edge
            //    var X = viewRadius * Math.sin(segmentTotal * Math.PI / 180.0);
            //    var Z = viewRadius * Math.cos(segmentTotal * Math.PI / 180.0);
            //
            //    data[i].x = X;
            //    data[i].z = Z;
            //    data[i].rotation = segmentTotal+180;
            //
            //    segmentTotal = segmentTotal + eachSegment;
            //
            //    itemCount++;
            //
            //    if(itemCount === data.length){
            //        deferred.resolve();
            //    }
            //
            //}

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


        $scope.attachCursorEvents = function(){

            $scope.activeThrow = false;

            var linkTimer;

            var cursor = document.querySelector('#cursor');
            var saber = document.querySelector('.saber');
            var link = document.querySelector('.link');

            cursor.addEventListener('click', function(e){
                console.log('cursor click');
                var el = document.querySelector('a-camera');
                var direction = el.components.rotation.data.y;

                console.log(direction);

                linkTimer = $timeout(function(){

                    if(e.detail.intersectedEl.attributes.link){
                        var link = e.detail.intersectedEl.attributes.link.nodeValue;
                        $location.path(link);
                        $location.replace();
                    }

                    //if(e.detail.intersectedEl.attributes.category){
                    //    var category = e.detail.intersectedEl.attributes.category.nodeValue;
                    //    $rootScope.navigate('layout.'+category);
                    //}

                }, 4000);

            });




            cursor.addEventListener('mouseenter', function(e){

                linkTimer = $timeout(function(){

                    if(e.detail.intersectedEl.attributes.category){
                        var category = e.detail.intersectedEl.attributes.category.nodeValue;
                        $rootScope.navigate('layout.'+category);
                    }

                    //var link = e.detail.intersectedEl.attributes.link.nodeValue;

                }, 4000);

            });

            cursor.addEventListener('mouseleave', function(){
                console.log('mouseleave');

                $timeout.cancel(linkTimer);

            });

        };

        $scope.attachBack = function(){




            var timer;

            var backButton = document.querySelector('.back');

            backButton.addEventListener('mouseenter', function(e) {

                console.log('hello');

                timer = $timeout(function(){

                    window.history.back();

                }, 2000);

            });

            backButton.addEventListener('mouseleave', function() {

                $timeout.cancel(timer);

            });


        };

        //$scope.spawner = function(){
        //
        //    var activeThrow = false;
        //
        //    /**Uncaught TypeError: Cannot read property 'removeBehavior' of undefined
        //     * core:schema:warn Unknown property `color` for component/system `undefined`. +0ms
        //     */
        //
        //
        //    AFRAME.registerComponent('spawner', {
        //        schema: {
        //            on: { default: 'click' },
        //            mixin: { default: '' },
        //            position: { default: '' },
        //            color: { default: 'blue'}
        //        },
        //        update: function () {
        //            var el = this.el;
        //            var spawn = this.spawn.bind(this);
        //            if (this.on === this.data.on) { return; }
        //            el.addEventListener(this.data.on, spawn);
        //
        //            this.on = this.data.on;
        //
        //
        //
        //
        //        },
        //
        //        spawn: function () {
        //
        //            if(!activeThrow){
        //
        //                activeThrow = true;
        //
        //                var el = document.querySelector('a-camera');
        //                var direction = el.components.rotation.data.y;
        //
        //               direction = direction + 180;
        //
        //                var start = 1;
        //                var end = 4.5;
        //
        //                var coords = {
        //                    startX : start * Math.sin(direction * Math.PI / 180.0),
        //                    startZ : start * Math.cos(direction * Math.PI / 180.0),
        //                    endX : end * Math.sin(direction * Math.PI / 180.0),
        //                    endZ : end * Math.cos(direction * Math.PI / 180.0)
        //                };
        //
        //                $scope.rotation = '0 '+direction+' -90';
        //                $scope.saberOrigin = coords.startX + ' 1 ' + coords.startZ;
        //                $scope.saberNexus = coords.endX + ' 2 ' + coords.endZ;
        //
        //                var el = this.el;
        //                var matrixWorld = el.object3D.matrixWorld;
        //                var position = new THREE.Vector3();
        //                position.setFromMatrixPosition(matrixWorld);
        //
        //                /** Unknown color {{saberNexus}} **/
        //
        //                //$templateRequest('modules/layout/saber.html').then(function(html){
        //                //
        //                //    var camera = document.querySelector('a-scene');
        //                //
        //                //    var e =$compile(html)($scope);
        //                //    $(camera).prepend(e);
        //                //
        //                //    //$(camera).prepend(html);
        //                //
        //                //    activeThrow = false;
        //                //
        //                //    var saber = document.querySelector('#saber');
        //                //
        //                //    saber.addEventListener('animationend', function(e){
        //                //
        //                //            if(e.detail.target.attributes.next && e.detail.target.attributes.next.nodeValue === 'stopAnimation'){
        //                //
        //                //                console.log('rip er out');
        //                //                $('#saber').remove();
        //                //                $('.detonation').remove();
        //                //                activeThrow = false;
        //                //
        //                //            }
        //                //
        //                //            if(e.detail.target.attributes.next){
        //                //                var nextEvent = e.detail.target.attributes.next.nodeValue;
        //                //                spawnSaber.emit(nextEvent);
        //                //            }
        //                //
        //                //
        //                //        });
        //                //
        //                //});
        //
        //                var spawnSaber = document.createElement('a-entity');
        //                spawnSaber.setAttribute('geometry','primitive:box');
        //                spawnSaber.setAttribute('material','opacity:0');
        //                spawnSaber.setAttribute('mixin', this.data.mixin);
        //                spawnSaber.setAttribute('class','saber');
        //                spawnSaber.setAttribute('position', coords.startX + ' 1 ' + coords.startZ);
        //                spawnSaber.setAttribute('rotation','0 '+direction+' -90');
        //
        //
        //                var cylinder1 = document.createElement('a-cylinder');
        //                cylinder1.setAttribute('scale','0.02 1 0.02');
        //                cylinder1.setAttribute('class','blade');
        //                cylinder1.setAttribute('material','color: blue');
        //                cylinder1.setAttribute('opacity','1');
        //                cylinder1.setAttribute('position','0 0 0');
        //
        //                var cylinder2 = document.createElement('a-cylinder');
        //                cylinder2.setAttribute('scale','0.035 1 0.035');
        //                cylinder2.setAttribute('material','color: blue');
        //                cylinder2.setAttribute('opacity','0.3');
        //                cylinder2.setAttribute('position','0 0 0');
        //
        //                var cylinder3 = document.createElement('a-cylinder');
        //                cylinder3.setAttribute('scale','0.05 1 0.05');
        //                cylinder3.setAttribute('material','color: blue');
        //                cylinder3.setAttribute('opacity','0.3');
        //                cylinder3.setAttribute('position','0 0 0');
        //                var cylinder4 = document.createElement('a-cylinder');
        //
        //                cylinder4.setAttribute('scale','0.02 0.2 0.02');
        //                cylinder4.setAttribute('material','color: grey');
        //                cylinder4.setAttribute('opacity','1');
        //                cylinder4.setAttribute('position','0 -0.6 0');
        //
        //                spawnSaber.appendChild(cylinder1);
        //                spawnSaber.appendChild(cylinder2);
        //                spawnSaber.appendChild(cylinder3);
        //                spawnSaber.appendChild(cylinder4);
        //
        //                var moveSaberForward = document.createElement('a-animation');
        //
        //                moveSaberForward.setAttribute('class', 'saberAnimation');
        //                moveSaberForward.setAttribute('attribute', 'position');
        //                moveSaberForward.setAttribute('to', coords.endX + ' 1.5 ' + coords.endZ);
        //                moveSaberForward.setAttribute('fill', 'forwards');
        //                moveSaberForward.setAttribute('dur', '1000');
        //                moveSaberForward.setAttribute('next', 'moveSaberBack');
        //
        //                var spinWhileMove = document.createElement('a-animation');
        //
        //                spinWhileMove.setAttribute('class', 'saberAnimation');
        //                spinWhileMove.setAttribute('attribute', 'rotation');
        //                spinWhileMove.setAttribute('to', '0 7200 -90');
        //                spinWhileMove.setAttribute('fill', 'forwards');
        //                spinWhileMove.setAttribute('dur', '2000');
        //
        //                var moveSaberBack = document.createElement('a-animation');
        //
        //                moveSaberBack.setAttribute('class', 'saberAnimation');
        //                moveSaberBack.setAttribute('attribute', 'position');
        //                moveSaberBack.setAttribute('to', coords.startX + ' 1 ' + coords.startZ);
        //                moveSaberBack.setAttribute('fill', 'forwards');
        //                moveSaberBack.setAttribute('dur', '1000');
        //                moveSaberBack.setAttribute('begin', 'moveSaberBack');
        //                moveSaberBack.setAttribute('next','stopAnimation');
        //
        //                spawnSaber.appendChild(moveSaberForward);
        //                spawnSaber.appendChild(spinWhileMove);
        //                spawnSaber.appendChild(moveSaberBack);
        //
        //                var camera = document.querySelector('a-scene');
        //                camera.appendChild(spawnSaber);
        //
        //                var bladeTracking;
        //
        //                bladeTracking = $interval(function(){
        //
        //                    //console.log('flying');
        //                    //
        //                    //var sceneEl = document.querySelector('.viewContainer');
        //                    //
        //                    //var mesh = spawnSaber.getObject3D('mesh');
        //                    //var object3D = spawnSaber.object3D;
        //                    //var originPoint = spawnSaber.object3D.position.clone();
        //                    //for (var vertexIndex = 0; vertexIndex < mesh.geometry.attributes.uv.array.length; vertexIndex++) {
        //                    //    var localVertex = mesh.geometry.attributes.uv.array[vertexIndex].clone();
        //                    //    var globalVertex = localVertex.applyMatrix4( object3D.matrix );
        //                    //    var directionVector = globalVertex.sub( object3D.position );
        //                    //
        //                    //    var ray = new THREE.Raycaster( originPoint, directionVector.clone().normalize() );
        //                    //    var collisionResults = ray.intersectObjects( sceneEl.object3D.children, true );
        //                    //    collisionResults.forEach(hit);
        //                    //}
        //                    //function hit(collision) {
        //                    //    if (collision.object === object3D) {
        //                    //        return;
        //                    //    }
        //                    //    if (collision.distance < directionVector.length()) {
        //                    //        if (!collision.object.el) { return; }
        //                    //        collision.object.el.emit('hit');
        //                    //    }
        //                    //}
        //
        //                }, 100);
        //
        //
        //
        //                spawnSaber.addEventListener('animationend', function(e){
        //
        //                    if(e.detail.target.attributes.next && e.detail.target.attributes.next.nodeValue === 'stopAnimation'){
        //
        //                        console.log('rip er out');
        //                        $('.saber').remove();
        //                        $('.detonation').remove();
        //                        $interval.cancel(bladeTracking);
        //                        activeThrow = false;
        //
        //                    }
        //
        //                    if(e.detail.target.attributes.next){
        //                        var nextEvent = e.detail.target.attributes.next.nodeValue;
        //                        spawnSaber.emit(nextEvent);
        //                    }
        //
        //
        //                });
        //
        //            }
        //
        //
        //
        //        }
        //    });
        //
        //    AFRAME.registerComponent('collider', {
        //        init: function() {
        //            this.el.sceneEl.addBehavior(this);
        //        },
        //
        //        update: function () {
        //            var sceneEl = this.el.sceneEl;
        //            var object3D = this.el.object3D;
        //            var originPoint = object3D.position.clone();
        //            for (var vertexIndex = 0; vertexIndex < object3D.geometry.vertices.length; vertexIndex++) {
        //                var localVertex = object3D.geometry.vertices[vertexIndex].clone();
        //                var globalVertex = localVertex.applyMatrix4( object3D.matrix );
        //                var directionVector = globalVertex.sub( object3D.position );
        //
        //                var ray = new THREE.Raycaster( originPoint, directionVector.clone().normalize() );
        //                var collisionResults = ray.intersectObjects( sceneEl.object3D.children );
        //                collisionResults.forEach(hit);
        //            }
        //            function hit(collision) {
        //                if (collision.object === object3D) {
        //                    return;
        //                }
        //                if (collision.distance < directionVector.length()) {
        //                    collision.object.el.emit('hit');
        //                }
        //            }
        //        }
        //    });
        //
        //};

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

        $scope.cameraSaberActive = false;
        $scope.throwTimer;

        $scope.cameraSaber = function(){

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

            cameraSaber.addEventListener('click', function(e){
                $scope.followLink(e);

            });
        };

        $scope.tick = function(el){

            el.els = [];
            el.collisions = [];
            el.elMax = new THREE.Vector3();
            el.elMin = new THREE.Vector3();

            var boundingBox = new THREE.Box3();
            var collisions = [];

            //var el = this.el;
            //var el = el;





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
                // Bounding boxes are always aligned with the world coordinate system.
                // The collision test checks for the conditions where cubes intersect.
                // It's an extension to 3 dimensions of this approach (with the condition negated)
                // https://www.youtube.com/watch?v=ghqD3e37R7E
                intersected = (self.elMin.x <= elMax.x && self.elMax.x >= elMin.x) &&
                    (self.elMin.y <= elMax.y && self.elMax.y >= elMin.y) &&
                    (self.elMin.z <= elMax.z && self.elMax.z >= elMin.z);
                if (!intersected) { return; }
                collisions.push(el);
            }

            function handleHit (hitEl) {
                hitEl.emit('hit');
                hitEl.addState(self.data.state);
                self.el.emit('hit', {el: hitEl});
            }

            function updateBoundingBox () {
                boundingBox.setFromObject(mesh);
                self.elMin.copy(boundingBox.min);
                self.elMax.copy(boundingBox.max);
            }

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

        $scope.followLink = function(e){
            $timeout(function(){

                if(e.detail.intersectedEl.attributes.link){
                    var link = e.detail.intersectedEl.attributes.link.nodeValue;
                    $location.path(link);
                    $location.replace();
                }

                if(e.detail.intersectedEl.attributes.category){
                    var category = e.detail.intersectedEl.attributes.category.nodeValue;
                    $rootScope.navigate('layout.'+category);
                }

            }, 3000);
        };

        $scope.loadBG = function(){

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


                // Not showing vendor prefixes.
                navigator.getUserMedia({video: true, audio: false, facingMode: "environment"}, function(localMediaStream) {
                    var assets = document.querySelector('a-assets');

                    var video = document.createElement('video');
                    video.setAttribute('autoplay','true');
                    video.setAttribute('id','arVideo');
                    video.src = window.URL.createObjectURL(localMediaStream);

                    // Note: onloadedmetadata doesn't fire in Chrome when using it with getUserMedia.
                    // See crbug.com/110938.
                    video.onloadedmetadata = function(e) {
                        // Ready to go. Do some stuff.
                        assets.appendChild(video);

                        var arVideo = document.createElement('a-video');
                        arVideo.setAttribute('src','#arVideo');
                        arVideo.setAttribute('height','100%');
                        arVideo.setAttribute('width','100%');
                        arVideo.setAttribute('position','0 2 -10');

                        var camera = document.querySelector('a-camera');

                        camera.appendChild(arVideo);
                    };
                }, errorCallback);

            }

        };


        $scope.init = function(){

            //$scope.attachCursorEvents();

            $scope.attachBack();

            //$scope.spawner();

            $scope.viveControls();

            $scope.cameraSaber();

            $scope.loadBG();

        };


        $scope.init();
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

    PlanetsController.$inject = ['$scope', '$location', 'APIService'];

    function PlanetsController ($scope, $location, APIService) {

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

        function createPlanets($compile) {
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
                            '<a-image src="'+imageSrc+'" scale="2 2 2" position="0 0 0" link="'+link+'"></a-image>'+
                            '<a-entity bmfont-text="text: '+planet.name+'; color: yellow; width: 300px; fnt: fonts/DejaVu-sdf.fnt; align: center;" position="-0.75 -1.5 0" link="'+planet.url+'"></a-entity>'+
                            '</a-entity>';

                    });

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
     * @module SWVR - Vehicles Controller
     * @description
     * Vehicles Controller
     *
     **/

    angular.module('SWVR')
        .controller('VehiclesController', VehiclesController)
        .directive('vehiclesWrapper', createVehicles);

    VehiclesController.$inject = ['$scope', '$location', 'APIService'];

    function VehiclesController ($scope, $location, APIService) {

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

    function createVehicles($compile) {
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
                        '<a-image src="'+imageSrc+'" scale="2 2 2" position="0 0 0" link="'+link+'"></a-image>'+
                        '<a-entity bmfont-text="text: '+vehicle.name+'; color: yellow; width: 300px; fnt: fonts/DejaVu-sdf.fnt; align: center;" position="-0.75 -1.5 0" link="'+vehicle.url+'"></a-entity>'+
                        '</a-entity>';

                });

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

    FilmController.$inject = ['$scope', '$state', '$location', 'APIService', 'AFRAME'];

    function FilmController ($scope, $state, $location, APIService, AFRAME) {

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

    SpeciesController.$inject = ['$scope', '$location', 'APIService'];

    function SpeciesController ($scope, $location, APIService) {

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
                    var link = thisSpecies.url.replace('http://swapi.co/api','');

                    /**
                     * The preferred method of document.createElement() resulted in the errors from AFRAME on every element created:
                     * Unknown property `src` for component/system `undefined` ('src' for the case of a-image)
                     */

                    html = html +
                        '<a-entity position="'+thisSpecies.x+' 2 '+thisSpecies.z+'" rotation="0 '+thisSpecies.rotation+' 0">'+
                        '<a-image src="'+imageSrc+'" scale="2 2 2" position="0 0 0" link="'+link+'"></a-image>'+
                        '<a-entity bmfont-text="text: '+thisSpecies.name+'; color: yellow; width: 300px; fnt: fonts/DejaVu-sdf.fnt; align: center;" position="-0.75 -1.5 0" link="'+thisSpecies.url+'"></a-entity>'+
                        '</a-entity>';

                });

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

                    /**
                     * The preferred method of document.createElement() resulted in the errors from AFRAME on every element created:
                     * Unknown property `src` for component/system `undefined` ('src' for the case of a-image)
                     */

                    html = html +
                        '<a-entity position="'+ship.x+' 2 '+ship.z+'" rotation="0 '+ship.rotation+' 0">'+
                        '<a-image src="'+imageSrc+'" scale="2 2 2" position="0 0 0" link="'+ship.url+'"></a-image>'+
                        '<a-entity bmfont-text="text: '+ship.name+'; color: yellow; width: 300px; fnt: fonts/DejaVu-sdf.fnt; align: center;" position="-0.75 -1.5 0" link="'+ship.url+'"></a-entity>'+
                        '</a-entity>';

                });

                var e =$compile(html)(scope);
                element.replaceWith(e);

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