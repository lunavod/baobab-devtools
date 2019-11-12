import React, { useState } from 'react'

import styles from './styles.css'
import { useBranch } from 'baobab-react/hooks'
import Value from '../Value/index.jsx'

import dateFormat from 'dateformat'
import classNames from 'classnames'
import PropTypes from 'prop-types'

/**
 * TreeHistory react component
 */
function TreeHistory() {
	const { tree, settings } = useBranch({
		tree: ['current_tree'],
		settings: ['settings']
	})

	if (!tree || !tree.history) {
		if (!tree) {
			return ''
		}
		return ''
	}

	let history = Array.from(tree.history)
	history.reverse()
	let local = history
	if (settings.history.showOnlyLastN)
		local = history.slice(0, settings.history.lastN)

	return (
		<div className={styles.main}>
			{local.map((update, update_i) => (
				<Update update={update} index={update_i} key={update.time} />
			))}
		</div>
	)
}

TreeHistory.propTypes = {}

function Path({ path }) {
	return path.map((path_part, i) => (
		<span className={styles.path} key={path_part}>
			{i > 0 ? <span className={styles.path_delim}>-&gt;</span> : ''}
			{path_part}
		</span>
	))
}

function Action({ action }) {
	return (
		<div className={styles.action}>
			<div>
				<span className={styles.action_type}>{action.type}</span>
				<span className={styles.path}>
					<Path path={action.path} />
				</span>
			</div>
		</div>
	)
}

Action.propTypes = {
	action: PropTypes.object
}

function Update({ update, index }) {
	const [actionsShown, setActionsShown] = useState(false)
	return (
		<div className={styles.transaction}>
			<div
				className={styles.changes}
				onClick={() => setActionsShown(!actionsShown)}
			>
				<div
					className={classNames({
						[styles.small_icon]: true,
						[styles.icon_show]: !actionsShown,
						[styles.icon_close]: actionsShown
					})}
				/>
				<div>
					{update.changes.map((change, i) => {
						return (
							<div className={styles.change} key={`update_${index}_change_${i}`}>
								<Path path={change[0]} />: <Value value={change[1]} />
								<span className={styles.changes_delim}>{' => '}</span>
								<Value value={change[2]} />
							</div>
						)
					})}
				</div>
			</div>
			<div
				className={classNames({
					[styles.actions]: true,
					[styles.shown]: actionsShown
				})}
			>
				{update.transaction.map((action, action_i) => (
					<Action
						action={action}
						key={`${index}_action_${action_i}`}
					/>
				))}
			</div>
		</div>
	)
}

Update.propTypes = {
	update: PropTypes.object.isRequired,
	index: PropTypes.number.isRequired
}

export default TreeHistory
