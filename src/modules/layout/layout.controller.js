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


        $scope.init = function(){

            //$scope.attachCursorEvents();

            $scope.attachBack();

            //$scope.spawner();

            $scope.viveControls();

            $scope.cameraSaber();

        };


        $scope.init();
    }



})();
