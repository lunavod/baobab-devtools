import React from 'react'

import styles from './styles.css'
import PropTypes from 'prop-types'

import Item from '../Item/index.jsx'

function getType(o) {
	if (o === null) return 'Null'
	if (o === undefined) return 'Undefined'
	var funcNameRegex = /function (.{1,})\(/
	var results = funcNameRegex.exec(o.constructor.toString())
	return results && results.length > 1 ? results[1] : ''
}

/**
 * Value react component
 */
function Value({ value, nesting }) {
	let html = <></>
	switch (getType(value)) {
		case 'Undefined':
			html = <span className={styles.undefined}>undefined</span>
			break
		case 'Null':
			html = <span className={styles.null}>null</span>
			break
		case 'String':
			html = <span className={styles.string}>{`"${value}"`}</span>
			break
		case 'Number':
			html = <span className={styles.number}>{value}</span>
			break
		case 'Boolean':
			html = <span className={styles.boolean}>{value ? 'true' : 'false'}</span>
			break
		case 'Array':
			html = (
				<span className={styles.array}>
					[{' '}
					{value.map((item, index) => (
						<>
							<Value nesting={nesting+1} value={item} />
							{index + 1 < value.length ? ', ' : ''}
						</>
					))}{' '}
					]
				</span>
			)
			break
		case 'Object':
			html = (
				<span className={styles.object}>
					{'{'}
					<Item nesting={nesting+1} item={value} />
					{'}'}
				</span>
			)
			break
	}
	return html
}

Value.propTypes = {
	value: PropTypes.any.isRequired
}

export default React.memo(Value)
