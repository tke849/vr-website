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
