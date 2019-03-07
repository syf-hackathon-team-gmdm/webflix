'use strict';

const WebTorrent = require('webtorrent')


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

  download: function(magnetId) {
    if (!magnetId) {
      return
    }

    var client = new WebTorrent()
    client.add(magnetId, function(torrent) {
      var file = client.files.find(function(file) {
        return file.name.endswith(".mp4")
      })
    })
    file.appendTo("#wf-app")
  },

  upload: function() {
    // TODO
  },

  convertToMagnet: function(torrentId) {
    // TODO
  }
}
