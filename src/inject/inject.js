console.log('STARTED', new Date().getSeconds())

var s = document.createElement('script')
s.src = chrome.runtime.getURL('src/inject/SecretAgent.js')
s.onload = function() {
	this.remove()
}
;(document.head || document.documentElement).appendChild(s)

window.addEventListener('message', function(event) {
	// Only accept messages from the same frame
	if (event.source !== window) {
		return
	}

	var message = event.data

	// Only accept messages that we know are ours
	if (
		typeof message !== 'object' ||
		message === null ||
		!message.source === 'my-devtools-extension'
	) {
		return
	}

	chrome.runtime.sendMessage(message)
})
