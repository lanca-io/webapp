import { memo } from 'react'
import { truncate } from '../../../../../utils/formatting'
import classNames from './SelectTokenShape.module.pcss'

interface SelectTokenShapeProps {
	symbol: string
	chainName: string
}

export const SelectTokenShape: React.FC<SelectTokenShapeProps> = memo(({ symbol, chainName }) => {
	return (
		<div className={classNames.selectTokenShape}>
			<h4>{truncate(symbol, 8)}</h4>
			<p className={classNames.body2}>{chainName}</p>
		</div>
	)
})
