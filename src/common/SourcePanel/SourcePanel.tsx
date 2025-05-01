import type { FC } from 'react'
import { useMemo } from 'react'
import { useAccount } from 'wagmi'
import { AmountInput } from '../AmountInput/AmountInput'
import { useFormStore } from '../../store/form/useFormStore'
import { BalanceInfo } from '../BalanceInfo/BalanceInfo'
import { ValueInfo } from '../ValueInfo/ValueInfo'
import { useInputHandlers } from '../../hooks/useInputHandlers'

export const SourcePanel: FC = () => {
	const { isConnected } = useAccount()
	const { onChange, onFocus, onBlur } = useInputHandlers()
	const { sourceToken, inputValue, inputMode } = useFormStore()

	console.log('inputValue', inputValue)
	console.log('inputMode', inputMode)

	const amountInput = useMemo(
		() => <AmountInput value={inputValue} onChange={onChange} onFocus={onFocus} onBlur={onBlur} />,
		[inputValue, onChange, onFocus, onBlur],
	)

	const balanceInfo = useMemo(
		() => (isConnected ? <BalanceInfo token={sourceToken} /> : null),
		[sourceToken, isConnected],
	)

	const valueInfo = useMemo(
		() => <ValueInfo mode={inputMode} value={inputValue} token={sourceToken} />,
		[inputMode, inputValue, sourceToken],
	)

	return (
		<>
			{amountInput}
			{valueInfo}
			{balanceInfo}
		</>
	)
}
