'use strict';

const WebTorrent = require('webtorrent')

//
// Helpers
//

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

var Webflix = function() {};

//
// Webflix prototypes
//

Webflix.prototype.init = function(torrentId) {
  this.torrentClient = new WebTorrent();
  this.torrentId = torrentId || document.getElementById("wf-torrent").value || "";
}

Webflix.prototype.reset = function() {
  document.getElementById("wf-player").innerHTML = "";
  document.getElementById("wf-downloaded").innerHTML = "";
  document.getElementById("wf-number-of-peers").innerHTML = "";
  document.getElementById("wf-peers").innerHTML = "";
  document.getElementById("wf-progress-bar").innerHTML = "";
  document.getElementById("wf-total").innerHTML = "";
  for (var index in this.torrentClient.torrents) {
    this.torrentClient.remove(this.torrentClient.torrents[index])
  }
}

Webflix.prototype.download = function() {
  if (!this.torrentId) {
    console.log("Cannot download due to no torrent set.");
    return
  }

  // destroy other torrents
  this.reset();

  // add new torrent
  this.torrentClient.add(this.torrentId, function(torrent) {
    var file = torrent.files.find(function(file) {
      return file.name.endsWith(".mp4")
        || file.name.endsWith(".mkv")
        || file.name.endsWith(".mov")
    })

    //Utility functions for torrent
    function onWire (wire) {
      var newPeer = document.createElement('div');
      newPeer.innerHTML = wire.remoteAddress || 'Unknown';
      document.querySelectorAll("#wf-peers")[0].appendChild( newPeer )
      wire.once('close', function () {
        newPeer.innerHTML = ""
      })
    }

    function onDone () {
      onProgress()
    }

    function onProgress () {
      var percent = Math.round(torrent.progress * 100 * 100) / 100
      document.getElementById("wf-progress-bar").style.width = percent + '%'
      document.getElementById("wf-number-of-peers").innerHTML = torrent.numPeers + (torrent.numPeers === 1 ? ' peer' : ' peers')

      document.getElementById("wf-downloaded").innerHTML = prettierBytes(torrent.downloaded)
      document.getElementById("wf-total").innerHTML = prettierBytes(torrent.length)
    }
    document.getElementById("wf-app").style.display = "block"
    file.appendTo("#wf-player")

    torrent.on('wire', onWire)
    torrent.on('done', onDone)

    torrent.on('download', throttle(onProgress, 250))
    torrent.on('upload', throttle(onProgress, 250))
    setInterval(onProgress, 5000)
    onProgress()

  })
}

Webflix.prototype.upload = function(input) {
  this.torrentClient.seed(input, function() {
    console.log("seeding torrent")
  })
}

Webflix.prototype.convertToMagnet = function(torrent) {
  // TODO
}


module.exports = {download: Webflix.prototype.download, init: Webflix.prototype.init, reset: Webflix.prototype.reset};
