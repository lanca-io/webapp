import type { DefaultValues } from './types'
import { useEffect } from 'react'
import { useFieldActions } from './useFieldActions'
import { formDefaultValues } from './createFormStore'

export const FormUpdater: React.FC<{ reactiveFormValues: Partial<DefaultValues> }> = ({ reactiveFormValues }) => {
	const { isTouched, resetField, setFieldValue, setUserAndDefaultValues } = useFieldActions()

	const setIfNotTouched = (fieldName: keyof DefaultValues, defaultValue: any) => {
		if (!isTouched(fieldName)) {
			setFieldValue(fieldName, defaultValue)
		}
	}

	useEffect(() => {
		setIfNotTouched('fromChain', formDefaultValues.fromChain)
		setIfNotTouched('toChain', formDefaultValues.toChain)
		setIfNotTouched('fromToken', formDefaultValues.fromToken)
		setIfNotTouched('toToken', formDefaultValues.toToken)
		setIfNotTouched('fromAmount', formDefaultValues.fromAmount)
		setIfNotTouched('toAmount', formDefaultValues.toAmount)
	}, [isTouched, resetField, setFieldValue])

	useEffect(() => {
		setUserAndDefaultValues(accountForChainId(reactiveFormValues))
	}, [reactiveFormValues, setUserAndDefaultValues])

	return null
}

const accountForChainId = (defaultValues: Partial<DefaultValues>): Partial<DefaultValues> => {
	const result: Partial<DefaultValues> = { ...defaultValues }
	for (const key in result) {
		const k = key as keyof DefaultValues
		if (result[k] === formDefaultValues[k] && (k === 'fromChain' || k === 'toChain')) {
			result[k] = formDefaultValues[k]
		}
	}
	return result
}
