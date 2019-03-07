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
  this.torrentId = document.getElementById("wf-torrent") || "";
}

Webflix.prototype.reset = function() {
  document.getElementById("wf-app").innerHTML = "";
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
  client.add(this.torrentId, function(torrent) {
    var file = torrent.files.find(function(file) {
      return file.name.endswith(".mp4")
        || file.name.endswith(".mkv")
        || file.name.endswith(".mov")
    })
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


module.exports = {download: Webflix.prototype.download};
