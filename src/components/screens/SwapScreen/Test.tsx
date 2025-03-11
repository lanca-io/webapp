import React from 'react'
import { useFieldController } from '../../../store/form/useFieldController'
import { useFormStore } from '../../../store/form/useFormStore'
import type { FormFieldNames } from '../../../store/form/types'

const InputField: React.FC<{ name: FormFieldNames; label: string }> = ({ name, label }) => {
	const { value, onChange, onBlur } = useFieldController({ name })

	return (
		<div>
			<label>
				{label}
				<input
					type="text"
					value={value as string}
					onChange={e => {
						onChange(e.target.value)
					}}
					onBlur={onBlur}
				/>
			</label>
		</div>
	)
}

const MockFormComponent: React.FC = () => {
	const setFieldValue = useFormStore(state => state.setFieldValue)
	const getFieldValues = useFormStore(state => state.getFieldValues)
	const resetField = useFormStore(state => state.resetField)
	const setDefaultValues = useFormStore(state => state.setDefaultValues)
	const addFieldValidation = useFormStore(state => state.addFieldValidation)
	const triggerFieldValidation = useFormStore(state => state.triggerFieldValidation)
	const fromAmount = useFormStore(state => state.userValues.fromAmount.value)
	const toAmount = useFormStore(state => state.userValues.toAmount.value)
	const errors = useFormStore(state => state.errors)

	const handleSetFieldValue = () => {
		setFieldValue('fromAmount', '100')
	}

	const handleGetFieldValue = () => {
		const fromAmount = getFieldValues('fromAmount')
		console.log('fromAmount:', fromAmount)
	}

	const handleResetField = () => {
		resetField('fromAmount')
	}

	const handleSetDefaultValues = () => {
		setDefaultValues({ fromAmount: '50', toAmount: '150' })
	}

	const handleAddValidation = () => {
		addFieldValidation('fromAmount', async value => {
			if (Number(value) < 0) {
				return 'Amount must be positive'
			}
			return true
		})
	}

	const handleTriggerValidation = async () => {
		const isValid = await triggerFieldValidation('fromAmount')
		console.log('Validation result:', isValid)
	}

	return (
		<div>
			<InputField name="fromAmount" label="From Amount" />
			<InputField name="toAmount" label="To Amount" />
			<button onClick={handleSetFieldValue}>Set From Amount</button>
			<button onClick={handleGetFieldValue}>Get From Amount</button>
			<button onClick={handleResetField}>Reset From Amount</button>
			<button onClick={handleSetDefaultValues}>Set Default Values</button>
			<button onClick={handleAddValidation}>Add Validation</button>
			<button onClick={handleTriggerValidation}>Trigger Validation</button>
			<div>
				<p>Current From Amount: {fromAmount}</p>
				<p>Current To Amount: {toAmount}</p>
				{errors.fromAmount && <p>Error: {errors.fromAmount}</p>}
			</div>
		</div>
	)
}

export default MockFormComponent
