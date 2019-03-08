'use strict';

const WebTorrent = require('webtorrent')
var $ = require('jquery')

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

  this.app = $("#wf-app")
  this.player = $("#wf-player")
  this.downloaded = $("#wf-downloaded")
  this.number_of_peers = $("#wf-number-of-peers")
  this.progress_bar = $("#wf-progress-bar")
}

Webflix.prototype.reset = function() {
  for (var index in this.torrentClient.torrents) {
    this.torrentClient.remove(this.torrentClient.torrents[index])
  }
  this.player.empty()
  this.downloaded.empty()
  this.number_of_peers.empty()
  this.progress_bar.empty()
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
        || file.name.endsWith(".webm")
    })

    //Utility functions for torrent
    function onWire (wire) {
      var new_peer = $("<div>", {"class": "wf-peer"})
      new_peer.text(wire.remoteAddress || 'Unknown');
      $("#wf-peers").append(new_peer)
      wire.once('close', function () {
        new_peer.empty()
      })
    }

    function onDone () {
      onProgress()
    }

    function onProgress () {
      var percent = Math.round(torrent.progress * 100 * 100) / 100
      webflix.progress_bar.width(percent + "%")

      $("#wf-peers-heading").text("Number of Peers: " + torrent.numPeers)

      webflix.downloaded.text(prettierBytes(torrent.downloaded) + " of " + prettierBytes(torrent.length))
    }
    webflix.app.css("display", "block")
    file.appendTo("#wf-player")
    var number_of_peers_heading = $("<h3>", {id: "wf-peers-heading"})
    number_of_peers_heading.css({"cursor": "pointer", "text-decoration": "underline"})
    webflix.number_of_peers.append(number_of_peers_heading)
    var peers = $("<div>", {"id": "wf-peers", "style": "display: none"})
    webflix.number_of_peers.append(peers)
    number_of_peers_heading.click(function(){
      $("#wf-peers").toggle()
      //css("display", "inline-block")
    })
    number_of_peers_heading.text("Number of Peers: 0")


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
