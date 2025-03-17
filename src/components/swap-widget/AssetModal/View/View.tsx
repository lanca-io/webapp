import type { FC } from 'react'
import type { ViewProps } from './types'
import classNames from './View.module.pcss'

export const View: FC<ViewProps> = ({ isExpanded, handleExpand, handleShowLess }) => {
	return (
		<div className={classNames['view-section']}>
			<button onClick={isExpanded ? handleShowLess : handleExpand} className={classNames['view-button']}>
				{isExpanded ? 'Show Less' : 'Show More'}
			</button>
		</div>
	)
}
