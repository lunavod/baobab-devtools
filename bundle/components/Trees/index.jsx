import React from 'react'
import styles from './styles.css'

import { useBranch } from 'baobab-react/hooks'
// import PropTypes from 'prop-types'

import Tree from '../Tree/index.jsx'

export default function Trees(props) {
	const { current_tree } = useBranch({
		current_tree: ['current_tree']
	})

	if (!current_tree) return ''

	return (
		<div>
			<Tree tree={current_tree.state} />
		</div>
	)
}
