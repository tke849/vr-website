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

            $sceDelegateProvider.resourceUrlWhitelist([
                'self']);

            //$locationProvider.html5Mode(true);


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
				templateUrl: 'modules/links/links.html',
				controller: 'LinksController',
				params: {
					saber: true
				}
			})

			.state('layout.person', {
				url: '/people/:id/',
				templateUrl: 'modules/details/details.html',
				controller: 'DetailsController',
				params: {
					saber: false
				}
			})

			.state('layout.starships', {
				url: '/starships/',
				templateUrl: 'modules/links/links.html',
				controller: 'LinksController',
				params: {
					saber: true
				}
			})

			.state('layout.starship', {
				url: '/starships/:id/',
				templateUrl: 'modules/details/details.html',
				controller: 'DetailsController',
				params: {
					saber: false
				}
			})

			.state('layout.species', {
				url: '/species/',
				templateUrl: 'modules/links/links.html',
				controller: 'LinksController',
				params: {
					saber: true
				}
			})

			.state('layout.type', {
				url: '/species/:id/',
				templateUrl: 'modules/details/details.html',
				controller: 'DetailsController',
				params: {
					saber: false
				}
			})

			.state('layout.vehicles', {
				url: '/vehicles/',
				templateUrl: 'modules/links/links.html',
				controller: 'LinksController',
				params: {
					saber: true
				}
			})

			.state('layout.vehicle', {
				url: '/vehicles/:id/',
				templateUrl: 'modules/details/details.html',
				controller: 'DetailsController',
				params: {
					saber: false
				}
			})

			.state('layout.planets', {
				url: '/planets/',
				templateUrl: 'modules/links/links.html',
				controller: 'LinksController',
				params: {
					saber: true
				}
			})

			.state('layout.planet', {
				url: '/planets/:id/',
				templateUrl: 'modules/details/details.html',
				controller: 'DetailsController',
				params: {
					saber: false
				}
			})

			.state('layout.films', {
				url: '/films/',
				templateUrl: 'modules/links/links.html',
				controller: 'LinksController',
				params: {
					saber: true
				}
			})

			.state('layout.film', {
				url: '/films/:id/',
				templateUrl: 'modules/details/details.html',
				controller: 'DetailsController',
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

        $scope.titlesMap = {
            films: {
                1: 'A New Hope',
                2: 'The Empire Strikes Back',
                3: 'Return of the Jedi',
                4: 'The Phantom Menace',
                5: 'Attack of the Clones',
                6: 'Revenge of the Sith',
                7: 'The Force Awakens'
            },
            vehicles: {
                4:  'Sand Crawler',
                6:  'T-16 skyhopper',
                7:  'X-34 landspeeder',
                8:  'TIE/LN starfighter',
                14: 'Snowspeeder',
                16: 'TIE bomber',
                18: 'AT-AT',
                19: 'AT-ST',
                20: 'Storm IV Twin-Pod cloud car',
                24: 'Sail barge',
                25: 'Bantha-II cargo skiff',
                26: 'TIE/IN interceptor',
                30: 'Imperial Speeder Bike',
                33: 'Vulture Droid',
                34: 'Multi-Troop Transport',
                35: 'Armored Assault Tank',
                36: 'Single Trooper Aerial Platform',
                37: 'C-9979 landing craft',
                38: 'Tribubble bongo',
                42: 'Sith speeder',
                44: 'Zephyr-G swoop bike',
                45: 'Koro-2 Exodrive airspeeder',
                46: 'XJ-6 airspeeder',
                50: 'LAAT/i',
                51: 'LAAT/c',
                53: 'AT-TE',
                54: 'SPHA',
                55: 'Flitknot speeder',
                56: 'Neimoidian shuttle',
                57: 'Geonosian starfighter',
                60: 'Tsmeu-6 personal wheel bike',
                62: 'Emergency Firespeeder',
                67: 'Droid tri-fighter',
                69: 'Oevvaor jet catamaran',
                70: 'Raddaugh Gnasp fluttercraft',
                71: 'Clone turbo tank',
                72: 'Corporate Alliance tank droid',
                73: 'Droid gunship',
                76: 'AT-RT'
            },
            starships: {
                2: 'CR90 corvette',
                3: 'Star Destroyer',
                5: 'Sentinel-class landing craft',
                9: 'Death Star',
                10: 'Millennium Falcon',
                11: 'Y-wing',
                12: 'X-wing',
                13: 'TIE Advanced x1',
                15: 'Executor',
                17: 'Rebel transport',
                21: 'Slave 1',
                22: 'Imperial shuttle',
                23: 'EF76 Nebulon-B escort frigate',
                27: 'Calamari Cruiser',
                28: 'A-wing',
                29: 'B-wing',
                31: 'Republic Cruiser',
                32: 'Droid control ship',
                39: 'Naboo fighter',
                40: 'Naboo Royal Starship',
                41: 'Scimitar',
                43: 'J-type diplomatic barge',
                47: 'AA-9 Coruscant freighter',
                48: 'Jedi starfighter',
                49: 'H-type Nubian yacht',
                52: 'Republic Assault ship',
                58: 'Solar Sailer',
                59: 'Trade Federation cruiser',
                61: 'Theta-class T-2c shuttle',
                63: 'Republic attack cruiser',
                64: 'Naboo star skiff',
                65: 'Jedi Interceptor',
                66: 'Arc-170',
                68: 'Banking clan frigte',
                74: 'Belbullab-22 starfighter',
                75: 'V-wing',
                77: 'T-70 X-wing fighter'
            },
            species: {
                1: 'Human',
                2: 'Droid',
                3: 'Wookiee',
                4: 'Rodian',
                5: 'Hutt',
                6: 'Yoda\'s species',
                7: 'Trandoshan',
                8: 'Mon Calamari',
                9: 'Ewok',
                10: 'Sullustan',
                11: 'Neimodian',
                12: 'Gungan',
                13: 'Toydarian',
                14: 'Dug',
                15: 'Twi\'lek',
                16: 'Aleena',
                17: 'Vulptereen',
                18: 'Xexto',
                19: 'Toong',
                20: 'Cerean',
                21: 'Nautolan',
                22: 'Zabrak',
                23: 'Tholothian',
                24: 'Iktotchi',
                25: 'Quermian',
                26: 'Kel Dor',
                27: 'Chagrian',
                28: 'Geonosian',
                29: 'Mirialan',
                30: 'Clawdite',
                31: 'Besalisk',
                32: 'Kaminoan',
                33: 'Skakoan',
                34: 'Muun',
                35: 'Togruta',
                36: 'Kaleesh',
                37: 'Pau\'an'
            },
            planets: {
                1: 'Tatooine',
                2:  'Alderaan',
                3:  'Yavin IV',
                4:  'Hoth',
                5:  'Dagobah',
                6:  'Bespin',
                7:  'Endor',
                8:  'Naboo',
                9:  'Coruscant',
                10: 'Kamino',
                11: 'Geonosis',
                12: 'Utapau',
                13: 'Mustafar',
                14: 'Kashyyyk',
                15: 'Polis Massa',
                16: 'Mygeeto',
                17: 'Felucia',
                18: 'Cato Neimoidia',
                19: 'Saleucami',
                20: 'Stewjon',
                21: 'Eriadu',
                22: 'Corellia',
                23: 'Rodia',
                24: 'Nal Hutta',
                25: 'Dantooine',
                26: 'Bestine IV',
                27: 'Ord Mantell',
                28: 'unknown',
                29: 'Trandosha',
                30: 'Socorro',
                31: 'Mon Cala',
                32: 'Chandrila',
                33: 'Sullust',
                34: 'Toydaria',
                35: 'Malastare',
                36: 'Dathomir',
                37: 'Ryloth',
                38: 'Aleen Minor',
                39: 'Vulpter',
                40: 'Troiken',
                41: 'Tund',
                42: 'Haruun Kal',
                43: 'Cerea',
                44: 'Glee Anselm',
                45: 'Iridonia',
                46: 'Tholoth',
                47: 'Iktotch',
                48: 'Quermia',
                49: 'Dorin',
                50: 'Champala',
                51: 'Mirial',
                52: 'Serenno',
                53: 'Concord Dawn',
                54: 'Zolan',
                55: 'Ojom',
                56: 'Skako',
                57: 'Muunilinst',
                58: 'Shili',
                59: 'Kalee',
                60: 'Umbara',
                61: 'Jakku'
            },
            people: {
                1:  'Luke Skywalker',
                2:  'C-3PO',
                3:  'R2-D2',
                4:  'Darth Vader',
                5:  'Leia Organa',
                6:  'Owen Lars',
                7:  'Beru Whitesun lars',
                8:  'R5-D4',
                9:  'Biggs Darklighter',
                10: 'Obi-Wan Kenobi',
                11: 'Anakin Skywalker',
                12: 'Wilhuff Tarkin',
                13: 'Chewbacca',
                14: 'Han Solo',
                15: 'Greedo',
                16: 'Jabba Desilijic Tiure',
                17:  null,
                18: 'Wedge Antilles',
                19: 'Jek Tono Porkins',
                20: 'Yoda',
                21: 'Palpatine',
                22: 'Boba Fett',
                23: 'IG-88',
                24: 'Bossk',
                25: 'Lando Calrissian',
                26: 'Lobot',
                27: 'Ackbar',
                28: 'Mon Mothma',
                29: 'Arvel Crynyd',
                30: 'Wicket Systri Warrick',
                31: 'Nien Nunb',
                32: 'Qui-Gon Jinn',
                33: 'Nute Gunray',
                34: 'Finis Valorum',
                35: 'Padmé Amidala',
                36: 'Jar Jar Binks',
                37: 'Roos Tarpals',
                38: 'Rugor Nass',
                39: 'Ric Olié',
                40: 'Watto',
                41: 'Sebulba',
                42: 'Quarsh Panaka',
                43: 'Shmi Skywalker',
                44: 'Darth Maul',
                45: 'Bib Fortuna',
                46: 'Ayla Secura',
                47: 'Ratts Tyerell',
                48: 'Dud Bolt',
                49: 'Gasgano',
                50: 'Ben Quadinaros',
                51: 'Mace Windu',
                52: 'Ki-Adi-Mundi',
                53: 'Kit Fisto',
                54: 'Eeth Koth',
                55: 'Adi Gallia',
                56: 'Saesee Tiin',
                57: 'Yarael Poof',
                58: 'Plo Koon',
                59: 'Mas Amedda',
                60: 'Gregar Typho',
                61: 'Cordé',
                62: 'Cliegg Lars',
                63: 'Poggle the Lesser',
                64: 'Luminara Unduli',
                65: 'Barriss Offee',
                66: 'Dormé',
                67: 'Dooku',
                68: 'Bail Prestor Organa',
                69: 'Jango Fett',
                70: 'Zam Wesell',
                71: 'Dexter Jettster',
                72: 'Lama Su',
                73: 'Taun We',
                74: 'Jocasta Nu',
                75: 'R4-P17',
                76: 'Wat Tambor',
                77: 'San Hill',
                78: 'Shaak Ti',
                79: 'Grievous',
                80: 'Tarfful',
                81: 'Raymus Antilles',
                82: 'Sly Moore',
                83: 'Tion Medon',
                84: 'Finn',
                85: 'Rey',
                86: 'Poe Dameron',
                87: 'BB8',
                88: 'Captain Phasma'

            }

        };

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
                    }, 4000);

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



        $scope.attachCrosshairEvents = function(){

            var cursor = document.querySelector('#crosshairs');
            var camera = document.querySelector('a-camera');

            cursor.addEventListener('mouseenter', function(e){


                /** HUD Titles **/
                if(e.detail.intersectedEl.attributes.title){

                    var title = e.detail.intersectedEl.attributes.title.nodeValue;

                    var hud = '<a-entity class="hud" position="-.4 1 -1.5">' +
                        '<a-entity bmfont-text="text: ' + title + '; color: yellow; width: 300px; fnt: fonts/DejaVu.fnt;' +
                        ' align:center;" position="0 0 0" scale=".5 .5 .5"></a-entity>';

                    $(camera).append(hud);

                }

            });

            cursor.addEventListener('mouseleave', function(e){

                var hud = document.querySelectorAll('.hud');
                $('.hud').remove();

            });

        };

        $scope.checkWeapon = function(){

            var cameraSaber = document.querySelector('.cameraSaber');
            var blaster  = document.querySelector('.blaster');

            //if(!$state.params.saber){
            //    $timeout(function(){
            //        cameraSaber.pause();
            //        //cameraSaber.traverse( function ( object ) { object.visible = false; } );
            //    }, 1500)
            //} else {
            //    //cameraSaber.traverse( function ( object ) { object.visible = true; } );
            //    cameraSaber.play();
            //}

        };



        $scope.init = function(){

            $scope.attachCrosshairEvents();

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
                        '<a-entity bmfont-text="text: '+title+'; color: yellow; width: 300px; fnt: fonts/DejaVu.fnt; align: center;" position="-0.75 -2 0" link="'+item.url+'" ></a-entity>'+
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
        .controller('DetailsController', DetailsController)
        .directive('createFrames', createFrames);

    DetailsController.$inject = ['$scope', '$location', 'APIService'];

    function DetailsController ($scope, $location, APIService) {

        var apiEndpoint = $location.$$path;

        $scope.init = function(){

            var data;

            var infoPromise = APIService.getData(apiEndpoint);

            infoPromise.then(function(results){

                data = results;

            }, function(err){

                console.log(err);

            }).finally(function(){

                var info = [];
                var detail = [];


                angular.forEach(data, function(value, key){

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

                    $scope.details = info;

                });

            });

        };

        $scope.init();

    }

    function createFrames($compile, $rootScope ) {
        return {
            restrict: 'EA',
            scope: {
                details: "=",
                titles: "="
            },
            link: function (scope, element, attrs) {

                var info = scope.details;

                var html = '';

                for (var key in info) {


                    /** First block film details **/
                    if (info.hasOwnProperty(key)) {

                        var object = info[key];
                        var title;
                        if(key === '0'){

                            title = object.name ? object.name : object.title;
                            title = title.toUpperCase();


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
                                    var mapCategory = scope.titles[category];
                                    var title = mapCategory[id];

                                    console.log(title);

                                    var imageScale = key === 'films' ? '1 2 1' : '1 1 1';

                                    var innerHtml = innerHtml +
                                        '<a-image title="'+title+'" position="'+left+' '+ height +' 0" scale="'+imageScale+'" src="' + imageSrc + '" ></a-image>';
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



                //$(container).append(html);

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