import type { FC } from 'react'
import { useState } from 'react'
import { useAccount } from 'wagmi'
import { useFormStore } from '../../../store/form/useFormStore'
import { BalanceDisplay } from './BalanceDisplay/BalanceDisplay'
import { useMode } from './useMode'
import { useInputHandlers } from './useInputHandlers'

import classNames from './AmountPanel.module.pcss'
import { useRouteStore } from '../../../store/route/useRouteStore'

export const AmountPanel: FC = () => {
	const { isConnected } = useAccount()
	const { srcToken } = useFormStore()
	const { routes, loading } = useRouteStore()
	const [value, setValue] = useState<string>('')

	console.log('routes', routes)
	console.log('loading', loading)

	const { mode, setMode, determineMode } = useMode(value, srcToken)
	const { handleChange, handleFocus, handleBlur } = useInputHandlers(setValue, mode, setMode, determineMode)

	return (
		<div className={classNames['amount-panel']}>
			<div className={classNames['amount-input-container']}>
				<div className={classNames['amount-input']}>
					<input
						type="text"
						className={classNames['input']}
						placeholder="0"
						value={value}
						onChange={handleChange}
						onFocus={handleFocus}
						onBlur={handleBlur}
					/>
				</div>
				<div className={classNames['enter-amount']}>{'= $100'}</div>
			</div>
			{isConnected && <BalanceDisplay token={srcToken} />}
		</div>
	)
}
