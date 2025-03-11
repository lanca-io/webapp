import { useImperativeHandle } from 'react'
import { formDefaultValues } from './createFormStore'
import type { FormRef, FormStoreStore, GenericFormValue, FieldNames, FieldValues } from './types'

export const useFormRef = (formStore: FormStoreStore, formRef?: FormRef) => {
	useImperativeHandle(formRef, () => {
		const sanitizeValue: Record<string, (value: any) => GenericFormValue> = {
			fromAmount: value =>
				(typeof value === 'number' ? value?.toPrecision() : value) || formDefaultValues.fromAmount,
			toAmount: value => (typeof value === 'number' ? value?.toPrecision() : value) || formDefaultValues.toAmount,
			toAddress: value => {
				const isToAddressObj = typeof value !== 'string'
				const address = (isToAddressObj ? value?.address : value) || formDefaultValues.toAddress

				return address
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
					? { isTouched: options?.setUrlSearchParam }
					: undefined

				formStore.getState().setFieldValue(fieldName, sanitizedValue, fieldValueOptions)
			},
		}
	}, [formStore])
}
