import {forEach} from 'lodash'

class BetterLocalStorage {
	constructor() {
		window.addEventListener('storage', e => {
			this.fireChange(e.key, this.get(e.key))
		})
	}

	listeners = []

	get(key, json = true) {
		let val = localStorage.getItem(key)

		if (!val) return val

		if (json) val = JSON.parse(val)

		return val
	}

	set(key, val) {
		localStorage.setItem(key, JSON.stringify(val))
		this.fireChange(key, val)
	}

	fireChange(key, val) {
		forEach(this.listeners, listener => {
			if (listener.key !== key) return
			listener.callback(val)
		})
	}

	listenChange(key, callback) {
		this.listeners.push({
			key,
			callback
		})
	}
}

const storage = new BetterLocalStorage()

export default storage