export function setShown(tree, val) {
	tree.select(['settings', 'shown']).set(val)
}

export function setHistoryLastN(tree, n) {
	tree.select(['settings', 'history', 'lastN']).set(n)
}

export function setHistoryShowOnlyLastN(tree, val) {
	tree.select(['settings', 'history', 'showOnlyLastN']).set(val)
}

export function setPaused(tree, val) {
	tree.select(['paused']).set(val)
}

export function setSize(tree, size) {
	tree.select(['settings', 'size']).set(size)
}