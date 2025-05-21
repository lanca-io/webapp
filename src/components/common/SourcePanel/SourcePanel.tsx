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
	const { fromToken, amountInput, amountInputFocused, addressInputFocused } = useFormStore()

	const hasBalance = Boolean(fromToken?.balance && fromToken.balance !== '0')
	const hasAmountValue = Boolean(amountInput && amountInput !== '0')
	const isCompact = addressInputFocused && !amountInputFocused && hasAmountValue

	const inputClassName = isCompact ? 'input-compact' : ''

	return (
		<div className={`source_panel ${isCompact ? 'source_panel-compact' : ''}`}>
			<WidgetInput
				value={amountInput}
				onChange={onChange}
				onFocus={onFocus}
				onBlur={onBlur}
				className={inputClassName}
			/>
			<ValueInfo />
			{isConnected && hasBalance && <BalanceInfo token={fromToken} />}
		</div>
	)
})
