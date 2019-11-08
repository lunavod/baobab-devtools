function log(...arr) {
	backgroundPageConnection.postMessage({
		name: 'log',
		data: arr
	})
}

var backgroundPageConnection = chrome.runtime.connect({
    name: "panel"
});

backgroundPageConnection.postMessage({
    name: 'init',
    tabId: chrome.devtools.inspectedWindow.tabId
});

function initDev() {
	document.querySelector('#reload').addEventListener('click', ()=>{
		location.reload()
	})

	document.querySelector('#reload_with_page').addEventListener('click', ()=>{
		location.reload()
		backgroundPageConnection.postMessage({
			name: 'reloadTab',
			tabId: chrome.devtools.inspectedWindow.tabId
		})
	})
	
	document.querySelector("#log_eval").addEventListener('keydown', ()=>{
		if (event.keyCode==13) {
			try {
				log(eval(document.querySelector("#log_eval").value), 'in')
			} catch (e) {
				log("Error: "+e.message, 'in', 'error')
			}
		}
	})
}
initDev()

function initTree(content, id) {
	log('Init', content, id)
	let trees = document.querySelector("#baobab_trees")
	let wrapper = trees.querySelector(`#tree_${id}`)
	if (!wrapper) {
		wrapper = document.createElement('div')
		wrapper.id = `tree_${id}`
	}
	wrapper.innerHTML = `<pre class="tree_content">${JSON.stringify(content.currentData, null, '   ')}</pre>
	<div class="history"></div>`
	trees.appendChild(wrapper)
}

function updateTree(data, id) {
	log('Update', data, id)
	let wrapper = document.querySelector(`#tree_${id}`)
	if (!wrapper) initTree(data, id)
	let history = wrapper.querySelector('.history')
	data.transaction.forEach(update => {
		log(update, `<span class="path>${update.path.join(".")}</span>`)
		let historyItem = document.createElement('div')
		historyItem.className = 'history_item'
		let html = ''
		let path
		switch(update.type) {
		case 'unset':
			html = `<span class="action">${update.type}</span>
				<span class="path">${update.path.join(".")}</span>`
			break
		case 'apply':
			html = `<span class="action">${update.type}</span>
				<span class="path">${update.path.join(".")}</span>`
			break
		case 'splice':
			html = `<span class="action">${update.type}</span><span class="value">(${update.value.join(",")})</span>
				<span class="path">${update.path.join(".")}</span>`
			break
		case 'concat':
			html = `<span class="action">${update.type}</span>
				<span class="path">${update.path.join(".")}[]</span>
				+=
				<span class="value">${JSON.stringify(update.value)}</span>`
			break
		case 'merge':
			html = `<span class="action">${update.type}</span>
				<span class="path">${update.path.join(".")}[]</span>
				+=
				<span class="value">${JSON.stringify(update.value)}</span>`
			break
		case 'deepMerge':
			html = `<span class="action">${update.type}</span>
				<span class="path">${update.path.join(".")}[]</span>
				+=
				<span class="value">${JSON.stringify(update.value)}</span>`
			break
		case 'push':
			path = Array.from(update.path)
			path.splice(path.length-1, 1)
			html = `<span class="action">${update.type}</span>
				<span class="path">${path.join(".")}[]</span>
				=
				<span class="value">${JSON.stringify(update.value)}</span>`
			break
		case 'unshift':
			path = Array.from(update.path)
			path.splice(path.length-1, 1)
			html = `<span class="action">${update.type}</span>
				<span class="path">${path.join(".")}[0]</span>
				=
				<span class="value">${JSON.stringify(update.value)}</span>`
			break
		default:
			html = `<span class="action">${update.type}</span>
				<span class="path">${update.path.join(".")}</span>
				=
				<span class="value">${JSON.stringify(update.value)}</span>`
			break
		}
		historyItem.innerHTML = html
		history.appendChild(historyItem)
		log(document.body.innerHTML)
	})
	wrapper.querySelector('.tree_content').innerText = JSON.stringify(data.currentData, null, '   ')
}

backgroundPageConnection.onMessage.addListener((msg) => {
	log("MESSAGE!", msg)
	if (msg.event=="initial_data") {
		initTree(msg.data, msg.tree_id)
	}
	if (msg.event=="update") {
		updateTree(msg.data, msg.tree_id)
	}
})