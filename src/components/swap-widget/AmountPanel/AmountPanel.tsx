import type { FC } from 'react'
import classNames from './AmountPanel.module.pcss'
import { AmountInput } from './AmountInput/AmountInput'

export const AmountPanel: FC = () => {
	return (
		<div className={classNames['amount-panel']}>
			<AmountInput />
		</div>
	)
}
