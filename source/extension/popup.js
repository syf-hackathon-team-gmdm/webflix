window.addEventListener('load', function load(event) {
    var createButton = document.getElementById('magnet-link-button');
    createButton.addEventListener('click', function() {
      webflix.download(document.getElementById('magnet-link-input').value)
    });
})
