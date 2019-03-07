const button = document.getElementById("magnet-link-button");
const input = document.getElementById("magnet-link-input");

button.addEventListener("click", function() {
  var torrentId = document.getElementById("wf-torrent").value || "";
  //input.value || "";
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
