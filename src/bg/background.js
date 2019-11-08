// if you checked "fancy-settings" in extensionizr.com, uncomment this lines

// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });


//example of using a message handler from the inject scripts
chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
  	chrome.pageAction.show(sender.tab.id);
    sendResponse();
  });

  var connections = {};

  chrome.runtime.onConnect.addListener(function (port) {
  
	  var extensionListener = function (message, sender, sendResponse) {
  
		  // The original connection event doesn't include the tab ID of the
		  // DevTools page, so we need to send it explicitly.
		  if (message.name == "init") {
			connections[message.tabId] = port;
			return;
		  }

		  if (message.name == "log") {
			console.log(...message.data)
			return;
		  }

		  if (message.name == "reloadTab") {
			  console.log(message)
			  setTimeout(()=>chrome.tabs.reload(message.tabId), 300)
		  }
  
	  // other message handling
	  }
  
	  // Listen to messages sent from the DevTools page
	  port.onMessage.addListener(extensionListener);
  
	  port.onDisconnect.addListener(function(port) {
		  port.onMessage.removeListener(extensionListener);
  
		  var tabs = Object.keys(connections);
		  for (var i=0, len=tabs.length; i < len; i++) {
			if (connections[tabs[i]] == port) {
			  delete connections[tabs[i]]
			  break;
			}
		  }
	  });
  });
  
  // Receive message from content script and relay to the devTools page for the
  // current tab
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	  // Messages from content scripts should have sender.tab set
	  if (sender.tab) {
		var tabId = sender.tab.id;
		if (tabId in connections) {
		  connections[tabId].postMessage(request);
		} else {
		  console.log("Tab not found in connection list.");
		}
	  } else {
		console.log("sender.tab not defined.");
	  }
	  return true;
  });