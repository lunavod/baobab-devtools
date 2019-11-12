export function setCurrentTree(tree, name) {
	tree.select('current_tree_name').set(name)
}