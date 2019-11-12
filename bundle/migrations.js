const migrations = [
	{
		version: 1,
		description: 'Size in settings',
		up: (tree) => {
			// if (tree.select(['settings', 'size']).get()) return
			tree.select(['settings', 'size']).set(65)
		}
	}
]

export default migrations