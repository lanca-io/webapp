import { memo } from 'react'
import { useAccount } from 'wagmi'
import { WidgetInput } from '../WidgetInput/WidgetInput'
import { useFormStore } from '../../../store/form/useFormStore'
import { BalanceInfo } from '../BalanceInfo/BalanceInfo'
import { ValueInfo } from '../ValueInfo/ValueInfo'
import { useInputHandlers } from '../../../hooks/useInputHandlers'
import './SourcePanel.pcss'

export const SourcePanel = memo((): JSX.Element => {
	const { isConnected } = useAccount()
	const { onChange, onFocus, onBlur } = useInputHandlers()
	const { fromToken, amountInput } = useFormStore()

	const hasBalance = Boolean(fromToken?.balance && fromToken.balance !== '0')

	return (
		<div className="source_panel" role="region" aria-label="Source input panel">
			<WidgetInput value={amountInput} onChange={onChange} onFocus={onFocus} onBlur={onBlur} />
			<ValueInfo />
			{isConnected && hasBalance && <BalanceInfo token={fromToken} />}
		</div>
	)
})
