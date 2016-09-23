CameraUtils = {};

var lookEventSetup = false;
CameraUtils.setupLookEvents = function () {
    if(lookEventSetup)
        return;

    // Detect when player is looking left and right
    var sceneEl = $("a-scene").get(0);
    //var cameraEl = sceneEl.camera.el;
    var cameraEl = sceneEl.cameraEl;

    sceneEl.addBehavior({
        el: { isPlaying: true },
        tick: function (t) {
            this.update();

        },
        lookingLeft: false,
        lookingRight: false,
        lookingUp: false,
        lookingDown: false,
        lastCameraRotation: cameraEl.getAttribute("rotation"),
        leftThreshold: 40,
        rightThreshold: -40,
        upThreshold: 7,
        downThreshold: -60,
        time: (new Date()).getTime(),
        update: function () {

            var time = (new Date()).getTime();
            var timeDelta = time - this.time;
            this.time = time;
            var rotation = cameraEl.getAttribute("rotation");
            var data = {
                time: time,
                timeDelta: timeDelta
            };


            // Left
            if (!this.lookingLeft && rotation.y > this.leftThreshold) {
                this.lookingLeft = true;
                cameraEl.emit("lookingLeftStart", data);

            }
            else if (this.lookingLeft && rotation.y < this.leftThreshold) {
                this.lookingLeft = false;
                cameraEl.emit("lookingLeftEnd", data);
            }
            else if(this.lookingLeft) {
                cameraEl.emit("lookingLeft", data);
                console.log('lookingLeft');
            }

            // Right
            if (!this.lookingRight && rotation.y < this.rightThreshold) {
                this.lookingRight = true;
                cameraEl.emit("lookingRightStart", data);
            }
            else if (this.lookingRight && rotation.y > this.rightThreshold) {
                this.lookingRight = false;
                cameraEl.emit("lookingRightEnd", data);
            }
            else if(this.lookingRight) {
                cameraEl.emit("lookingRight", data);
            }

            // Up
            if (!this.lookingUp && rotation.x > this.upThreshold) {
                this.lookingUp = true;
                cameraEl.emit("lookingUpStart", data);
            }
            else if (this.lookingUp && rotation.x < this.upThreshold) {
                this.lookingUp = false;
                cameraEl.emit("lookingUpEnd", data);
            }
            else if(this.lookingUp) {
                cameraEl.emit("lookingUp", data);
            }

            // Down
            if (!this.lookingDown && rotation.x < this.downThreshold) {
                this.lookingDown = true;
                cameraEl.emit("lookingDownStart", data);
            }
            else if (this.lookingDown && rotation.x > this.downThreshold) {
                this.lookingDown = false;
                cameraEl.emit("lookingDownEnd", data);
            }
            else if(this.lookingDown) {
                cameraEl.emit("lookingDown", data);
            }

            this.lastCameraRotation = rotation;
        }
    });

    return cameraEl;
};

return CameraUtils;


$scope.attachLookEvents = function() {

    // Add animations to thumb conainer
    var cameraEl = CameraUtils.setupLookEvents();
    var thumbSlideSpeed = 30; // m/s


    $(cameraEl).on("lookingLeft", function (e) {
        $scope.rotateThumbs(e.originalEvent.detail.timeDelta, -thumbSlideSpeed);
    })
        .on("lookingRight", function (e) {
            $scope.rotateThumbs(e.originalEvent.detail.timeDelta, thumbSlideSpeed);
        })
};

$scope.rotateThumbs =function (deltaTimeMilliseconds, speed) {

    var containerElement = $("." + $scope.thumbContainerClassName).get(0);
    var rotation = containerElement.getAttribute("rotation") || Utils.getDefaultXYZ();
    rotation.y += ( deltaTimeMilliseconds / 1000 ) * speed;
    containerElement.setAttribute("rotation", Utils.xyzString(rotation))

};