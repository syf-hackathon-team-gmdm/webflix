'use strict';

const WebTorrent = require('webtorrent')
//Should be in init??
var client = new WebTorrent()

function throttle (func, wait) {
  var ctx, args, rtn, timeoutID; // caching
  var last = 0;

  return function throttled () {
    ctx = this;
    args = arguments;
    var delta = new Date() - last;
    if (!timeoutID)
      if (delta >= wait) call();
      else timeoutID = setTimeout(call, wait - delta);
    return rtn;
  };

  function call () {
    timeoutID = 0;
    last = +new Date();
    rtn = func.apply(ctx, args);
    ctx = null;
    args = null;
  }
}

function prettierBytes (num) {
  if (typeof num !== 'number' || isNaN(num)) {
    throw new TypeError('Expected a number, got ' + typeof num)
  }

  var neg = num < 0
  var units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  if (neg) {
    num = -num
  }

  if (num < 1) {
    return (neg ? '-' : '') + num + ' B'
  }

  var exponent = Math.min(Math.floor(Math.log(num) / Math.log(1000)), units.length - 1)
  num = Number(num / Math.pow(1000, exponent))
  var unit = units[exponent]

  if (num >= 10 || num % 1 === 0) {
    // Do not show decimals when the number is two-digit, or if the number has no
    // decimal component.
    return (neg ? '-' : '') + num.toFixed(0) + ' ' + unit
  } else {
    return (neg ? '-' : '') + num.toFixed(1) + ' ' + unit
  }
}

//
// Webflix
//

var Webflix = function(opts) {
  owner = this;
  owner.init();
}

//
// Webflix prototypes
//


Webflix.prototype = {

  init: function() {
    owner.torrentId = document.getElementById("fw-torrent") || "";
  },

  reset: function() {
    for (var index in client.torrents) {
      client.remove(client.torrents[index])
    }
    document.querySelector("#wf-app").innerHTML = ""
    document.querySelector("#wf-peers").innerHtml = ""
    document.querySelector("#wf-progress-bar").innerHTML = ""
    document.querySelector("#wf-number-of-peers").innerHTML = ""
    document.querySelector("#wf-downloaded").innerHTML = ""
    document.querySelector("#wf-total").innerHTML = ""
  },

  download: function(magnetId) {
    if (!magnetId) {
      return
    }
  
    //Only one torrent at a time... Destroy other torrents
    Webflix.prototype.reset()

    //Now add the new torrent
    client.add(magnetId, function(torrent) {
      var file = torrent.files.find(function(file) {
        return file.name.endsWith(".mp4")
      })

      //Utility functions for torrent
      function onWire (wire) {
        var newPeer = document.createElement('div');
        newPeer.innerHTML = wire.remoteAddress || 'Unknown';
        document.querySelector("#wf-peers").appendChild( newPeer )
        wire.once('close', function () {
          newPeer.innerHTML = ""
        })
      }

      function onDone () {
        onProgress()
      }

      function onProgress () {
        var percent = Math.round(torrent.progress * 100 * 100) / 100
        document.querySelector("#wf-progress-bar").style.width = percent + '%'
        document.querySelector("#wf-number-of-peers").innerHTML = torrent.numPeers + (torrent.numPeers === 1 ? ' peer' : ' peers')

        document.querySelector("#wf-downloaded").innerHTML = prettierBytes(torrent.downloaded)
        document.querySelector("#wf-total").innerHTML = prettierBytes(torrent.length)
      }

      file.appendTo("#wf-app")

      torrent.on('wire', onWire)
      torrent.on('done', onDone)

      torrent.on('download', throttle(onProgress, 250))
      torrent.on('upload', throttle(onProgress, 250))
      setInterval(onProgress, 5000)
      onProgress()
    })
  },


  upload: function(input) {
    var client = new WebTorrent()
    client.seed(input, function(){
      console.log("Seeding torrent!")
    })
  },

  convertToMagnet: function(torrentId) {
    // TODO
  }
}

module.exports = {download: Webflix.prototype.download};
