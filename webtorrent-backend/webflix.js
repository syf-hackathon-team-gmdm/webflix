/**
 * Webflix
 */

const WebTorrent = require('webtorrent')

(function() {
  const client = new WebTorrent()
  const torrentId = document.getElementById("torrent") || ""
  if (torrentId) {
    client.add(torrentId, function(torrent) {
      var file = torrent.files.find(function(file) {

        // todo: add more media extensions
        return file.name.endswith(".mp4")
      })
    })
  }

  // <div id="wf-app"> or <section id="wf-app">
  file.appendTo("#wf-app")
})
