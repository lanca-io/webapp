import type { FC } from 'react'
import classNames from './AmountInput.module.pcss'

export const AmountInput: FC = () => {
	return (
		<div className={classNames['amount-input']}>
			<input type="text" className={classNames['input']} placeholder="0" />
		</div>
	)
}
