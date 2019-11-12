import React, { useState } from 'react'

import styles from './styles.css'
import PropTypes from 'prop-types'
import { useBranch } from 'baobab-react/hooks'
import classNames from 'classnames'
import { setCurrentTree } from '../../actions/trees'
import { setPaused } from '../../actions/settings'

import {
	setHistoryLastN,
	setHistoryShowOnlyLastN,
	setShown
} from '../../actions/settings'

/**
 * Header react component
 */
function Header(props) {
	const { trees, current_tree_name, settings, paused, dispatch } = useBranch({
		trees: ['trees'],
		current_tree_name: ['current_tree_name'],
		tabsSizes: ['tabsSizes'],
		settings: ['settings'],
		paused: ['paused']
	})

	const [tabsSizes, setTabsSizes] = useState({})

	const reloadWithPage = () => {
		props.connection.postMessage({
			name: 'reloadTab',
			tabId: chrome.devtools.inspectedWindow.tabId
		})
		location.reload()
	}

	const pause = () => {
		props.connection.postMessage({
			name: 'pause',
			tabId: chrome.devtools.inspectedWindow.tabId
		})
		dispatch(setPaused, true)
	}

	const resume = () => {
		props.connection.postMessage({
			name: 'resume',
			tabId: chrome.devtools.inspectedWindow.tabId
		})
		dispatch(setPaused, false)
	}

	const names = Object.keys(trees)

	return (
		<>
			<div className={styles.panel_header}>
				<div className={styles.tabs}>
					<div className={styles.tabs_slider_wrapper}>
						<div
							className={styles.tabs_slider}
							style={{
								width: tabsSizes[current_tree_name]
									? tabsSizes[current_tree_name].width + 'px'
									: '',
								marginLeft: tabsSizes[current_tree_name]
									? tabsSizes[current_tree_name].left - 8 + 'px'
									: ''
							}}
						/>
					</div>
					{names.map(name => (
						<a
							ref={el => {
								if (!el) return
								let box = el.getBoundingClientRect()
								if (!(name in tabsSizes))
									setTabsSizes({
										...tabsSizes,
										[name]: box
									})
							}}
							key={`tree_${name}`}
							className={classNames({
								[styles.active]: current_tree_name == name
							})}
							onClick={() => dispatch(setCurrentTree, name)}
						>
							{name}
						</a>
					))}
				</div>
				<div className={styles.actions}>
					<a
						href="#"
						className={classNames({
							[styles.icon_button]: true,
							[styles.resume_icon]: paused,
							[styles.pause_icon]: !paused
						})}
						onClick={paused ? resume : pause}
					/>
					<a
						href="#"
						className={classNames({
							[styles.icon_button]: true,
							[styles.reload_icon]: true
						})}
						onClick={reloadWithPage}
					/>
					<a
						href="#"
						className={classNames({
							[styles.icon_button]: true,
							[styles.settings_icon]: true,
							[styles.active]: settings.shown
						})}
						onClick={() => dispatch(setShown, !settings.shown)}
					/>
				</div>
			</div>
			<div
				className={classNames({
					[styles.settings]: true,
					[styles.shown]: settings.shown
				})}
			>
				<span
					className={styles.setting}
					onClick={() =>
						dispatch(setHistoryShowOnlyLastN, !settings.history.showOnlyLastN)
					}
				>
					<input
						type="checkbox"
						checked={settings.history.showOnlyLastN}
						name="showOnlyLastN"
						id="showOnlyLastN"
						onClick={() =>
							dispatch(setHistoryShowOnlyLastN, !settings.history.showOnlyLastN)
						}
					/>
					<label htmlFor="showOnlyLastN">
						Show only last{' '}
						<input
							type="number"
							className={styles.last_n_input}
							value={settings.history.lastN}
							onChange={e => dispatch(setHistoryLastN, e.target.value)}
						/>{' '}
						items of history
					</label>
				</span>
			</div>
		</>
	)
}

Header.propTypes = {
	connection: PropTypes.object.isRequired
}

export default Header
