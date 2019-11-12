import storage from '../utils/BetterLocalStorage'

/**
 * Sets up migrations
 * 
 * @param {object} tree Baobab tree
 * @param {Array} migrations array of migrations
 */
export default function setUpMigrations(tree, migrations) {
	let storeVersion = storage.get('__store_version') || 0
	for (let migration of migrations) {
		if (migration.version <= storeVersion) continue
		console.log('migrations_progress', [migration.description])
		migration.up(tree)
		console.log('migrations_progress', ['Done!'])
		storeVersion = migration.version
	}
	storage.set('__store_version', storeVersion)
}