import type { FC } from 'react'
import { AddressMode } from '../../../store/form/types'
import { useFormStore } from '../../../store/form/useFormStore'
import { truncateAddress } from '../../../utils/new/truncate'
import './AddressInfo.pcss'

export const AddressInfo: FC = () => {
	const { addressInput, addressInputError, addressInputMode, toAddress } = useFormStore()

	const showError = !!addressInputError
	const showPrompt = !showError && addressInputMode === AddressMode.None && !addressInput.trim()
	const showAddress = !!toAddress && addressInputMode === AddressMode.ENS
	const showDash = !showError && !showPrompt && !!addressInput.trim() && !showAddress

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
			{showAddress && (
				<span className="asset_info_title" aria-label="No info">
					{truncateAddress(toAddress, 6, 6)}
				</span>
			)}
		</div>
	)
}
