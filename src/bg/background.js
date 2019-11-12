// if you checked "fancy-settings" in extensionizr.com, uncomment this lines

// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });

//example of using a message handler from the inject scripts
chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
	chrome.pageAction.show(sender.tab.id)
	sendResponse()
})

var connections = {}

chrome.runtime.onConnect.addListener(function(port) {
	var extensionListener = function(message) {
		// The original connection event doesn't include the tab ID of the
		// DevTools page, so we need to send it explicitly.
		if (message.name == 'init') {
			if (connections[message.tabId]) {
				connections[message.tabId].port = port
				connections[message.tabId].buffer = false
				connections[message.tabId].data.forEach(msg => port.postMessage(msg))
				connections[message.tabId].data = []
				return
			}
			connections[message.tabId] = {port}
			return
		}

		if (message.name == 'pause') {
			console.log('PAUSE')
			connections[message.tabId].buffer = true
			return
		}

		if (message.name == 'resume') {
			console.log('RESUME')
			connections[message.tabId].buffer = false
			connections[message.tabId].data.forEach(msg => port.postMessage(msg))
			connections[message.tabId].data = []
			return
		}

		if (message.name == 'log') {
			console.log(...message.data)
			return
		}

		if (message.name == 'reloadTab') {
			console.log(message)
			setTimeout(() => chrome.tabs.reload(message.tabId), 300)
		}

		// other message handling
	}

	// Listen to messages sent from the DevTools page
	port.onMessage.addListener(extensionListener)

	port.onDisconnect.addListener(function(port) {
		port.onMessage.removeListener(extensionListener)

		var tabs = Object.keys(connections)
		for (var i = 0, len = tabs.length; i < len; i++) {
			if (connections[tabs[i]].port == port) {
				delete connections[tabs[i]].port
				break
			}
		}
	})
})

// Receive message from content script and relay to the devTools page for the
// current tab
chrome.runtime.onMessage.addListener(function(request, sender) {
	// Messages from content scripts should have sender.tab set
	console.log('request', request)
	if (sender.tab) {
		var tabId = sender.tab.id
		if (tabId in connections) {
			if (!connections[tabId].buffer) {
				connections[tabId].port.postMessage(request)
			} else {
				connections[tabId].data.push(request)
				console.log('PUSHED TO HISTORY', connections)
			}
		} else {
			connections[tabId] = {buffer: true, data: [request]}
		}
	} else {
		console.log('sender.tab not defined.')
	}
	return true
})
