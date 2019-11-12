import React, { useState } from 'react'
import styles from './styles.css'
import Value from '../Value/index.jsx'
import classNames from 'classnames'

function getType(o) {
	if (o == undefined) return ''
	var funcNameRegex = /function (.{1,})\(/
	var results = funcNameRegex.exec(o.constructor.toString())
	return results && results.length > 1 ? results[1] : ''
}

function Item(props) {
	let type = getType(props.item)

	const nesting = props.nesting || 1

	let [keysState, setKeysState] = useState({})

	if (type == 'Object') {
		let keys = Object.keys(props.item)
		return (
			<div className={styles.object}>
				{keys.map((key, key_index) => {
					let val = props.item[key]
					let valType = getType(val)
					return (
						<div
							className={classNames({
								[styles.field]: true,
								[styles.multiline]:
									((valType == 'Object' || valType == 'Array') &&
										Object.keys(val).length !== 0 &&
										(nesting < 2 && !keysState[key])) ||
									(keysState[key] && keysState[key].open),
								[styles.foldable]:
									(valType == 'Object' || valType == 'Array') &&
									Object.keys(val).length !== 0
							})}
							key={key}
						>
							<span>
								<span
									className={styles.name}
									onClick={() => {
										if (valType != 'Object' && valType != 'Array') return
										if (Object.keys(val).length === 0) return
										setKeysState({
											...keysState,
											[key]: {
												open:
													!((nesting < 2 && !keysState[key]) ||
													(keysState[key] && keysState[key].open))
											}
										})
									}}
								>
									{key}
								</span>
								<span className={styles.secondary}>
									: {valType == 'Object' ? '{' : ''}
									{valType == 'Array' ? '[' : ''}
								</span>
							</span>
							<span className={styles.value}>
								{(valType != 'Object' && valType != 'Array') ||
								(nesting < 2 && !keysState[key]) ||
								(keysState[key] && keysState[key].open) ? (
									<Item nesting={nesting + 1} item={val} />
								) : (
									'...'
								)}
							</span>
							<span className={styles.secondary}>
								{valType == 'Object' ? '}' : ''}
								{valType == 'Array' ? ']' : ''}
								{key_index != keys.length - 1 ? ',' : ''}
							</span>
						</div>
					)
				})}
			</div>
		)
	}
	if (type == 'Array') {
		return (
			<div className={styles.array}>
				{props.item.map((el, index) => {
					return (
						<div
							className={classNames({
								[styles.field]: true
								// [styles.multiline]: valType == 'Object' || valType == 'Array'
							})}
							key={index}
						>
							<Item nesting={nesting + 1} item={el} />
							<span className={styles.secondary}>
								{index == props.item.length - 1 ? '' : ','}
							</span>
						</div>
					)
				})}
			</div>
		)
	}

	return (
		<>
			&nbsp;
			<Value value={props.item} nesting={nesting + 1} />
		</>
	)
}

export default React.memo(Item)
