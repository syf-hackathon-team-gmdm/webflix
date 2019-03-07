// Copyright (c) 2019 Herbert Shin (@initbar).
// All rights reserved under MIT license.


// chrome.windows.update(windowId, { state: "fullscreen" })

chrome.windows.onCreated.addListener(function() {
  console.log("opened")
})
