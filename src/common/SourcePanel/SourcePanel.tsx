import type { FC } from 'react'
import { useMemo } from 'react'
import { useAccount } from 'wagmi'
import { AmountInput } from '../AmountInput/AmountInput'
import { useFormStore } from '../../store/form/useFormStore'
import { BalanceInfo } from '../BalanceInfo/BalanceInfo'
import { ValueInfo } from '../ValueInfo/ValueInfo'
import { useInputHandlers } from '../../hooks/useInputHandlers'
import './SourcePanel.pcss'

export const SourcePanel: FC = () => {
	const { isConnected } = useAccount()
	const { onChange, onFocus, onBlur } = useInputHandlers()
	const { sourceToken, inputValue, inputMode } = useFormStore()

	const amountInput = useMemo(
		() => <AmountInput value={inputValue} onChange={onChange} onFocus={onFocus} onBlur={onBlur} />,
		[inputValue, onChange, onFocus, onBlur],
	)

	const balanceInfo = useMemo(
		() => (isConnected ? <BalanceInfo token={sourceToken} /> : null),
		[sourceToken, isConnected],
	)

	const valueInfo = useMemo(() => <ValueInfo />, [inputMode, inputValue, sourceToken])

	return (
		<div className="source_panel">
			{amountInput}
			{valueInfo}
			{balanceInfo}
		</div>
	)
}
