import type { FC } from 'react'
import { WidgetInput } from '../WidgetInput/WidgetInput'
import { useAddressInputHandlers } from '../../../hooks/useAddressInput'
import { useFormStore } from '../../../store/form/useFormStore'
import { AddressInfo } from '../AddressInfo/AddressInfo'
import './AddressCard.pcss'

export const AddressCard: FC = () => {
	const { addressInput } = useFormStore()
	const { onChange, onFocus, onBlur } = useAddressInputHandlers()

	return (
		<div className="address_card">
			<WidgetInput
				value={addressInput}
				onChange={onChange}
				onFocus={onFocus}
				onBlur={onBlur}
				placeholder="Wallet"
			/>
			<AddressInfo />
		</div>
	)
}
