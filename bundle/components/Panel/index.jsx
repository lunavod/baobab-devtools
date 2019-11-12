import React, {useState, useEffect} from 'react'
import styles from './styles.css'

import { useRoot, useBranch } from 'baobab-react/hooks'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import Trees from '../Trees/index.jsx'
import TreeHistory from '../TreeHistory/index.jsx'
import Header from '../Header/index.jsx'
import {setSize} from '../../actions/settings'

function Panel(props) {

	const {settings, dispatch} = useBranch({
		settings: ['settings']
	})

	const [firstSize, setFirstSize] = useState(settings.size)
	const [isResizing, setIsResizing] = useState(false)

	const [isHorizontal, setIsHorizontal]  = useState(window.innerWidth > window.innerHeight)
	window.addEventListener('resize', () => {
		setIsHorizontal(window.innerWidth > window.innerHeight)
	})

	const horizontalResizableRef = el => {
		if (!el || isResizing) return
		const onDown = event_down => {
			let newSize
			const onMove = event_move => {
				document.body.classList.add('col-resize')
				newSize = event_move.x/(window.innerWidth/100)
				if (newSize < 30 || newSize > 70) return
				setFirstSize(newSize)
			}

			const onUp = event_up => {
				document.body.classList.remove('col-resize')
				document.removeEventListener('mousemove', onMove)
				document.removeEventListener('mouseup', onUp)
				el.removeEventListener('mousedown', onDown)
				setIsResizing(false)
				if (newSize < 30) {
					dispatch(setSize, 30)
				} else if (newSize > 70) {
					dispatch(setSize, 70)
				} else {
					dispatch(setSize, newSize)
				}
			}

			document.addEventListener('mousemove', onMove)
			document.addEventListener('mouseup', onUp)
			setIsResizing(true)
		}
		el.addEventListener('mousedown', onDown)
	}

	const verticalResizableRef = el => {
		if (!el || isResizing) return
		const onDown = event_down => {
			let newSize
			const onMove = event_move => {
				document.body.classList.add('row-resize')
				newSize = event_move.y/(window.innerHeight/100)
				if (newSize < 30 || newSize > 70) return
				setFirstSize(newSize)
			}

			const onUp = event_up => {
				document.body.classList.remove('row-resize')
				document.removeEventListener('mousemove', onMove)
				document.removeEventListener('mouseup', onUp)
				el.removeEventListener('mousedown', onDown)
				setIsResizing(false)
				if (newSize < 30) {
					dispatch(setSize, 30)
				} else if (newSize > 70) {
					dispatch(setSize, 70)
				} else {
					dispatch(setSize, newSize)
				}
			}

			document.addEventListener('mousemove', onMove)
			document.addEventListener('mouseup', onUp)
			setIsResizing(true)
		}
		el.addEventListener('mousedown', onDown)
	}

	let ref = isHorizontal? horizontalResizableRef : verticalResizableRef


	return (
		<React.Fragment>
			<Header connection={props.connection} />
			<div className={classNames({
				[styles.main]: true,
				[styles.with_settings]: settings.shown,
				[styles.horizontal]: isHorizontal,
				[styles.vertical]: !isHorizontal,
			})}>
				<div className={styles.first} style={{[isHorizontal? 'width': 'height']: `${firstSize}%`}}>
					<Trees />
				</div>
				<div className={styles.delimeter} ref={ref} />
				<div className={styles.second}  style={{[isHorizontal? 'width': 'height']: `${100-firstSize}%`}}>
					<TreeHistory />
				</div>
			</div>
		</React.Fragment>
	)
}

Panel.propTypes = {
	connection: PropTypes.object.isRequired,
	tree: PropTypes.object.isRequired
}

export default function RootComponent(props) {
	const Root = useRoot(props.tree)
	return <Root><Panel {...props} /></Root>
}