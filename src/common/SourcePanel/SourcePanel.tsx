import type { FC } from 'react'
import { useState, useMemo } from 'react'
import { useAccount } from 'wagmi'
import { useInputMode } from '../../hooks/useInputMode'
import { AmountInput } from '../AmountInput/AmountInput'
import { useFormStore } from '../../store/form/useFormStore'
import { BalanceInfo } from '../BalanceInfo/BalanceInfo'
import { ValueInfo } from '../ValueInfo/ValueInfo'
import { useInputHandlers } from '../../hooks/useInputHandlers'

export const SourcePanel: FC = () => {
	const [value, setValue] = useState<string>('')

	const { isConnected } = useAccount()
	const { sourceToken } = useFormStore()
	const { mode, setMode, determineMode } = useInputMode(value, sourceToken)
	const { onChange, onFocus, onBlur } = useInputHandlers(setValue, mode, setMode, determineMode)

	const amountInput = useMemo(
		() => <AmountInput value={value} onChange={onChange} onFocus={onFocus} onBlur={onBlur} />,
		[value, onChange, onFocus, onBlur],
	)

	const balanceInfo = useMemo(
		() => (isConnected ? <BalanceInfo token={sourceToken} setInputValue={setValue} /> : null),
		[sourceToken, isConnected],
	)

	const valueInfo = useMemo(() => <ValueInfo mode={mode} value={value} token={sourceToken} />, [mode, value])

	return (
		<>
			{amountInput}
			{valueInfo}
			{balanceInfo}
		</>
	)
}
