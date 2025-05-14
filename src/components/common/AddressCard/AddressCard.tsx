import type { FC } from 'react'
import { WidgetInput } from '../WidgetInput/WidgetInput'
import { useAddressInputHandlers } from '../../../hooks/useAddressInput'
import './AddressCard.pcss'

export const AddressCard: FC = () => {
	const { address, onChange, onFocus, onBlur } = useAddressInputHandlers()

	return (
		<div className="address_card">
			<WidgetInput
				value={address}
				onChange={onChange}
				onFocus={onFocus}
				onBlur={onBlur}
				placeholder="Wallet or ENS"
			/>
		</div>
	)
}
