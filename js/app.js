'use strict';

/*

  Explore this idea: authoring of images happens point-and-click style in vr mode.

  Todo

  * play() -> webgl/webvr scene
  * add controls to each picture card
  * move up/down
  * retake
  * front/back camera
  * add text
  * delete
  * instructions panel
  * storage (multiple stories)
  * name the story
  * save the story
  * view saved stories
  * open/edit saved story
  * share somehow
  * undo delete

  Ideas

  * emoticon vr carnival
  * party vr: other people's pics show up randomly
  * some kind of zooming ui to view a specific pic

*/

window.addEventListener('DOMContentLoaded', function() {

  qs('#start').classList.add('animated', 'fadeIn', 'visible')
  qs('#snap').classList.add('animated', 'fadeIn', 'visible')

  var start = document.querySelector('#start'),
      gStream = null;

  qs('#start').onclick = play;
  qs('#snap').onclick = showCameraPreview;
  qs('#shutter').onclick = takePicture

  function showCameraPreview(cb) {
    navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
      var track = stream.getVideoTracks()[0];
      gStream = track;
      var vidURL = window.URL.createObjectURL(stream);
      //cb(vidURL);
      //
      var vid = document.querySelector('#vid');
      vid.src = vidURL;
      vid.play();
      vid.onloadedmetadata = function(e) {
        qs('#preview').classList.toggle('visible');
        qs('#shutter').classList.toggle('visible');
      }
      //
    });
  }

  showCameraPreview(function(url) {
    console.log(url)
    VR.video([url])
  })

  function takePicture() {
    var vid = document.querySelector('#vid'),
        width = 320,
        height = vid.videoHeight / (vid.videoWidth/width),
        canvas = document.createElement('canvas'),
        context = canvas.getContext('2d');

    canvas.width = width;
    canvas.height = height;
    context.drawImage(vid, 0, 0, width, height);

    gStream.stop();

    qs('#preview').classList.toggle('visible')
    qs('#shutter').classList.toggle('visible')

    addSnapshot(canvas);
  }

  function addSnapshot(canvas) {
    var card = document.createElement('div')
    card.classList.add('imagePreview')
    card.appendChild(canvas)

    var container = document.querySelector('#container'),
        preview = document.querySelector('#preview');
    if (preview.nextSibling) {
      container.insertBefore(card, preview.nextSibling);
    }
    else {
      container.appendChild(card);
    }
  }

  // create vr scene
  function play() {
    // make a floor
    VR.floor();
    // add a kanye
    VR.image('http://38.media.tumblr.com/tumblr_m9473r4uzP1rue873o1_400.png')
    // EMOJIFY
    VR.text('👍👍👍')
  }
});

function detectQRCodeInVideo(videoElement, callback) {
  videoElement.onloadedmetadata = function(e) {
    var qrdc = new QCodeDecoder()
    qrdc.decodeFromVideo(videoElement, function (err) {
      if (err)
        throw err;
      callback(result);
    })
  }
}

function uploadPhotoToImgur(fileBlob, callback) {
  // Get file object
  var file = fileBlob;

  // Create object for form data
  var fd = new FormData();

  // Add file to form data
  fd.append("image", file);

  var xhr = new XMLHttpRequest();
  xhr.open("POST", "https://api.imgur.com/3/upload.json");
  xhr.onload = function() {
    var data = JSON.parse(xhr.responseText).data;
    var imgurURL = data.link;
    callback(imgurURL)
  }   

  var clientId = 'Client-ID 1ca3a1cf63cc8bc';
  xhr.setRequestHeader('Authorization', clientId);
  xhr.send(fd);
}

function getRandomCoordinates(container) {
  var fullWidth = window.innerWidth;
  var fullHeight = window.innerHeight;
  //var fullWidth = container ? container.width : window.innerWidth;
  //var fullHeight = container ? container.height : window.innerHeight;
  return {
    x: Math.round(Math.random() * fullWidth) + "px",
    y: Math.round(Math.random() * fullHeight) + "px"
  }
}

function classify(selector, classesToAdd, classesToRemove) {
  var els = document.querySelectorAll(selector)
  //console.log('matches for', selector, els.length, 'adding:', classesToAdd, 'removing:', classesToRemove)
  for (var i = 0; i < els.length; i++) {
    if (classesToAdd)
      classesToAdd.forEach(function(c) { els[i].classList.add(c) })
    if (classesToRemove)
      classesToAdd.forEach(function(c) { els[i].classList.remove(c) })
  }
}

function qs(selector) {
  return document.querySelector(selector);
}

