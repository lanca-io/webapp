import { memo } from 'react'
import { useFormStore } from '../../../store/form/useFormStore'
import { useValueConversion } from '../../../hooks/useValueConversion'
import { SourceValue } from '../SourceValue/SourceValue'
import { Mode } from '../../../store/form/types'
import './ValueInfo.pcss'
import { useAccount } from 'wagmi'

export const ValueInfo = memo((): JSX.Element => {
	const { isConnected } = useAccount()
	const { amountInputError, amountInput, amountInputMode } = useFormStore()
	const { usd } = useValueConversion()

	const showError = !!amountInputError
	const showPrompt = amountInputMode === Mode.None || !amountInput.trim()
	const showIndicator = !showError && !showPrompt && usd

	return (
		<div className="value_info_container" role="status" aria-live="polite">
			{showError && (
				<span className="value_info_title value_info_error" aria-live="assertive" role="alert">
					{amountInputError}
				</span>
			)}
			{showPrompt && (
				<span className="value_info_title" aria-label="Input prompt">
					{isConnected ? 'Enter amount, % or $' : 'Enter amount'}
				</span>
			)}
			{showIndicator && <SourceValue />}
		</div>
	)
})
