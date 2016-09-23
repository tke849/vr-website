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