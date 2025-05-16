import type { FC } from 'react'
import { AddressMode } from '../../../store/form/types'
import { useFormStore } from '../../../store/form/useFormStore'
import './AddressInfo.pcss'

export const AddressInfo: FC = () => {
	const { addressInput, addressInputError, addressInputMode } = useFormStore()

	const showError = !!addressInputError
	const showPrompt = addressInputMode === AddressMode.None || !addressInput.trim()
	const showDash = !showError && !showPrompt && !!addressInput.trim()

	return (
		<div className="asset_info_container">
			{showError && (
				<span className="asset_info_title asset_info_error" aria-live="assertive" role="alert">
					{addressInputError}
				</span>
			)}
			{showPrompt && (
				<span className="asset_info_title" aria-label="Input prompt">
					Enter Address
				</span>
			)}
			{showDash && (
				<span className="asset_info_title" aria-label="No info">
					-
				</span>
			)}
		</div>
	)
}
