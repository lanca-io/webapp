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
	const { fromToken, amountInput, amountInputFocused, addressInputFocused, fromAmount } = useFormStore()

	const hasBalance = Boolean(fromToken?.balance && fromToken.balance !== '0')
	const isCompact = addressInputFocused && !amountInputFocused
	const inputClassName = isCompact ? 'input-compact' : ''

	console.log('From token passed to the BalanceInfo', fromToken)
	console.log('Formatted token', Number(fromToken?.balance) / 10 ** (fromToken?.decimals ?? 18))
	console.log('Amount input', amountInput)
	console.log('From amount', fromAmount)

	return (
		<div className={`source_panel`}>
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
