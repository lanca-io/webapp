import type { FC } from 'react'
import { AmountDisplay } from './AmountDisplay/AmountDisplay'
import classNames from './DestinationAmount.module.pcss'

export const DestinationAmount: FC = () => {
	return (
		<div className={classNames['destination-panel']}>
			<AmountDisplay />
		</div>
	)
}
