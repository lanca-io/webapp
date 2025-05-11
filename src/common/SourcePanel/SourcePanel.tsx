import { memo } from 'react'
import { useAccount } from 'wagmi'
import { AmountInput } from '../AmountInput/AmountInput'
import { useFormStore } from '../../store/form/useFormStore'
import { BalanceInfo } from '../BalanceInfo/BalanceInfo'
import { ValueInfo } from '../ValueInfo/ValueInfo'
import { useInputHandlers } from '../../hooks/useInputHandlers'
import './SourcePanel.pcss'

export const SourcePanel = memo((): JSX.Element => {
	const { isConnected } = useAccount()
	const { onChange, onFocus, onBlur } = useInputHandlers()
	const { sourceToken, inputValue } = useFormStore()

	const hasBalance = Boolean(sourceToken?.balance && sourceToken.balance !== '0')

	return (
		<div className="source_panel" role="region" aria-label="Source input panel">
			<AmountInput value={inputValue} onChange={onChange} onFocus={onFocus} onBlur={onBlur} />
			<ValueInfo />
			{isConnected && hasBalance && <BalanceInfo token={sourceToken} />}
		</div>
	)
})
