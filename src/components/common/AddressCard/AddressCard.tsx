import type { FC, ChangeEvent } from 'react'
import { useState } from 'react'
import { WidgetInput } from '../WidgetInput/WidgetInput'
import './AddressCard.pcss'

export const AddressCard: FC = () => {
	const [address, setAddress] = useState<string>('')

	const handleAddressChange = (e: ChangeEvent<HTMLInputElement>) => {
		setAddress(e.target.value)
	}

	return (
		<div className="address_card">
			<WidgetInput value={address} onChange={handleAddressChange} placeholder="Wallet or ENS" />
			<p className="address-card-display">{address ? `Current Address: ${address}` : 'No address entered'}</p>
		</div>
	)
}
