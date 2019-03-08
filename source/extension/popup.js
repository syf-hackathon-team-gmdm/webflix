const button = document.getElementById("magnet-link-button");
const input = document.getElementById("wf-torrent");

button.addEventListener("click", function() {
  var torrentId = input.value || "";
  if (!torrentId) {
    // add shake effect
    input.classList.add("shake");
    setTimeout(function() {
      input.classList.remove("shake");
    }, 1000);
  } else {
    // download torrent
    webflix.init(torrentId)
    webflix.download();
  }
})

