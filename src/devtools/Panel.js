const { Baobab, registerStored, setUpMigrations, migrations, ReactDOM, React, Panel } = window.bundle

var backgroundPageConnection = chrome.runtime.connect({
	name: 'panel'
})

backgroundPageConnection.postMessage({
	name: 'init',
	tabId: chrome.devtools.inspectedWindow.tabId
})

const tree = new Baobab({
	trees: {},
	current_tree_name: null,
	current_tree: Baobab.monkey({
		cursors: {
			trees: ['trees'],
			current_tree_name: ['current_tree_name']
		},
		get: function({ trees, current_tree_name }) {
			return trees[current_tree_name]
		}
	}),
	tabsSizes: {},
	settings: {
		shown: true,
		size: 65,
		history: {
			showOnlyLastN: false,
			lastN: 10
		}
	},
	paused: true
})

const stored = [
	{
		path: ['settings'],
		name: 'settings'
	}
]

registerStored(stored, tree)
setUpMigrations(tree, migrations)

function initTree(data, id) {
	if (!tree.select('current_tree_name').get())
		tree.select('current_tree_name').set(id)
	tree.select(['trees']).set(id, { state: data.currentData, history: [] })
	tree.select(['paused']).set(false)
}

function getValueFromState(state, path) {
	let obj = state
	path.forEach(part => {
		obj = obj[part]
	})
	return obj
}

function getType(o) {
	if (o == undefined) return ''
	var funcNameRegex = /function (.{1,})\(/
	var results = funcNameRegex.exec(o.constructor.toString())
	return results && results.length > 1 ? results[1] : ''
}

function areSame(a, b) {
	let aType = getType(a)
	let bType = getType(b)

	if (aType != bType) return false

	if (aType == 'Object' || aType == 'Array') {
		let aKeys = Object.keys(a)
		let bKeys = Object.keys(b)
		
		if (aKeys.length != bKeys.length) return false

		for (let key of aKeys) {
			if (b[key] == undefined) return false
			if (b[key] != a[key]) return false
		}
		return true
	}

	return a === b
}

function updateTreeState(data, id) {
	let trees = tree.select('trees').get()
	if (!(id in trees)) {
		return initTree(data, id)
	}
	tree.select(['trees', id, 'state']).set(data.currentData)
	let filteredPaths = data.paths.filter(
		path =>
			!areSame(
				getValueFromState(data.previousData, path),
				getValueFromState(data.currentData, path)
			)
	)
	tree.select(['trees', id, 'history']).push({
		state: data.currentData,
		transaction: data.transaction,
		time: data.time,
		paths: filteredPaths,
		changes: filteredPaths.map(path => [
			path,
			getValueFromState(data.previousData, path),
			getValueFromState(data.currentData, path)
		])
	})
}

backgroundPageConnection.onMessage.addListener(msg => {
	if (msg.event == 'initial_data') {
		initTree(msg.data, msg.tree_id)
	}
	if (msg.event == 'update') {
		updateTreeState(msg.data, msg.tree_id)
		// emitter.fire(`tree_${msg.tree_id}/update`, msg.data)
		// updateTree(msg.data, msg.tree_id)
	}
})

ReactDOM.render(
	React.createElement(Panel, {
		connection: backgroundPageConnection,
		tree: tree
	}),
	document.querySelector('#main')
)
