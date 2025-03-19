import type { FC } from 'react'
import { useAccount } from 'wagmi'
import { useFormStore } from '../../../store/form/useFormStore'
import { BalanceDisplay } from './BalanceDisplay/BalanceDisplay'
import { AmountInput } from './AmountInput/AmountInput'

import classNames from './AmountPanel.module.pcss'

export const AmountPanel: FC = () => {
	const { isConnected } = useAccount()
	const { srcToken } = useFormStore()

	return (
		<div className={classNames['amount-panel']}>
			<div className={classNames['amount-input-container']}>
				<AmountInput />
			</div>
			{isConnected && Number(srcToken?.balance) > 0 && <BalanceDisplay token={srcToken} />}
		</div>
	)
}
