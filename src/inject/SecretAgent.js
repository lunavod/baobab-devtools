
console.log('TRUE SPY IS HERE!', (new Date()).getSeconds())

function registerBaobabStore(tree, id) {
	tree.on('update', (e) => {
		let data = {
			...e.data
		}
		data.transaction.forEach((update, index) => {
			if (update.type=="apply") data.transaction[index].value = ""
		})
		console.log('UPDATE', e)
		window.postMessage({
			event: 'update',
			data: data,
			tree_id: id,
			source: 'my-devtools-extension'
		  }, '*');
	})
	window.postMessage({
		event: 'initial_data',
		data: {currentData: tree.get()},
		tree_id: id,
		source: 'my-devtools-extension'
	  }, '*');
	console.log('Store registered!')
}

document.dispatchEvent(new CustomEvent('baobabExtensionReady'))

window.postMessage({
	greeting: 'hello there!',
	source: 'my-devtools-extension'
  }, '*');