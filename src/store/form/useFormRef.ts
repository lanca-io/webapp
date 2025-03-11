import type { FormRef, FormStoreStore, GenericFormValue, FieldNames, FieldValues } from './types'
import { useImperativeHandle } from 'react'
import { formDefaultValues } from './createFormStore'

export const useFormRef = (formStore: FormStoreStore, formRef?: FormRef) => {
	useImperativeHandle(formRef, () => {
		const sanitizeValue: Record<string, (value: any) => GenericFormValue> = {
			fromAmount: value =>
				(typeof value === 'number' ? value.toPrecision() : value) || formDefaultValues.fromAmount,
			toAmount: value => (typeof value === 'number' ? value.toPrecision() : value) || formDefaultValues.toAmount,
			toAddress: value => {
				const address = typeof value !== 'string' ? value?.address : value
				return address || formDefaultValues.toAddress
			},
		}

		return {
			setFieldValue: (
				fieldName: FieldNames,
				value: FieldValues[FieldNames],
				options?: { setUrlSearchParam?: boolean },
			) => {
				const sanitizedValue = sanitizeValue[fieldName] ? sanitizeValue[fieldName](value) : value
				const fieldValueOptions = options?.setUrlSearchParam
					? { isTouched: options.setUrlSearchParam }
					: undefined
				formStore.getState().setFieldValue(fieldName, sanitizedValue, fieldValueOptions)
			},
		}
	}, [formStore])
}
