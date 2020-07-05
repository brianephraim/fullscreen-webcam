function activateFullscreen(element) {
  element = element || document.querySelector("video");

  if (element.requestFullscreen) {
    element.requestFullscreen(); // W3C spec
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen(); // Firefox
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen(); // Safari
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen(); // IE/Edge
  }
}

;

function deactivateFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
}

;

function fullscreen() {
  if (document.fullscreenElement === null) {
    activateFullscreen();
  } else {
    deactivateFullscreen();
  }
}

window.onload = function () {
  var debug = true;
  var constraints = {
    audio: false,
    video: true
  };

  if (debug && window.location.host.indexOf('localhost') >= 0) {
    navigator.mediaDevices.enumerateDevices().then(function (devices) {
      devices.forEach(function (device) {
        console.log(device.kind + ": LABEL = \"" + device.label + "\" ID = " + device.deviceId);
      });
    });
    var deviceId = '28005dd0619938dd2f553cf7e3934d38fc94fd1518de4189d4730726e866bc13';
    constraints = {
      audio: true,
      video: {
        optional: [{
          sourceId: deviceId
        }]
      },
      deviceId: {
        exact: deviceId
      }
    };
  }

  document.addEventListener('keydown', function (event) {
    var key = event.key; // Or const {key} = event; in ES6+

    if (key === "Escape") {
      fullscreen();
    }
  });

  navigator.mediaDevices.getUserMedia(constraints).then(function (mediaStream) {
    var video = document.querySelector('video');
    video.srcObject = mediaStream;
    video.play();
  }).catch(function (err) {
    alert("yikes, and err!" + err.message);
  });
};
