console.log('TRUE SPY IS HERE!', new Date().getSeconds())

function sendMessage(obj) {
	window.postMessage(
		{
			...obj,
			source: 'my-devtools-extension'
		},
		'*'
	)
}

function registerBaobabStore(tree, id) { // eslint-disable-line no-unused-vars
	tree.on('update', e => {
		let data = {
			...e.data
		}
		data.transaction.forEach((update, index) => {
			if (update.type == 'apply') data.transaction[index].value = ''
		})
		data.time = new Date()
		console.log('UPDATE', e)
		sendMessage({
			event: 'update',
			data: data,
			tree_id: id
		})
	})
	sendMessage({
		event: 'initial_data',
		data: { currentData: tree.get() },
		tree_id: id
	})
	console.log('Store registered!')
}

document.dispatchEvent(new CustomEvent('baobabExtensionReady'))

sendMessage({
	greeting: 'hello there!'
})
