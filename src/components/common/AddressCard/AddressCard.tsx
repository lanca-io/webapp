import type { FC } from 'react'
import { WidgetInput } from '../WidgetInput/WidgetInput'
import { useAddressInputHandlers } from '../../../hooks/useAddressInput'
import { useFormStore } from '../../../store/form/useFormStore'
import './AddressCard.pcss'
import { AddressInfo } from '../AddressInfo/AddressInfo'

export const AddressCard: FC = () => {
	const { addressInput, addressInputError, addressInputMode, toAddress } = useFormStore()
	const { onChange, onFocus, onBlur } = useAddressInputHandlers()

	console.log('AddressInput', addressInput)
	console.log('AddressInputError', addressInputError)
	console.log('AddressInputMode', addressInputMode)
	console.log('ToAddress', toAddress)

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
