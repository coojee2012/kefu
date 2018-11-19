//var html = document.body.innerHTML;
var url = document.URL;
chrome.extension.onMessage.addListener(
  function (request, sender, sendMessage) {
    if (request.greeting == "hello")
      sendMessage(url);
    else
      sendMessage("FUCK OFF"); // snub them.
  });
