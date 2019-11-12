import React from 'react'
import styles from './styles.css'

import Item from '../Item/index.jsx'

export default function Tree(props) {
	return <div className={styles.main}>
		<div className={styles.secondary}>{'{'}</div>
		<div className={styles.tree}>
			<Item item={props.tree} />
		</div>
		<div className={styles.secondary}>{'}'}</div>
	</div>
}