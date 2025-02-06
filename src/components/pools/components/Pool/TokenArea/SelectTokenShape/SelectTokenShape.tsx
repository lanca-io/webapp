import { memo } from 'react'
import classNames from './SelectTokenShape.module.pcss'

interface SelectTokenShapeProps {
	symbol: string
	chainName: string
}

export const SelectTokenShape: React.FC<SelectTokenShapeProps> = memo(({ symbol, chainName }) => {
	return (
		<div className={classNames.selectTokenShape}>
			<h4>{symbol}</h4>
			<p className={classNames.body2}>{chainName}</p>
		</div>
	)
})
