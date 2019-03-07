const button = document.getElementById("magnet-link-button");
const input = document.getElementById("magnet-link-input");

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
    Webflix.download(torrentId);
  }
})
