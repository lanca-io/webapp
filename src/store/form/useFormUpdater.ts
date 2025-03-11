import type { DefaultValues } from './types'
import { useAccount } from 'wagmi'
import { useEffect } from 'react'
import { useFieldActions } from './useFieldActions.js'
import { formDefaultValues } from './createFormStore.js'

export const FormUpdater: React.FC<{
	reactiveFormValues: Partial<DefaultValues>
}> = ({ reactiveFormValues }) => {
	const { isConnected } = useAccount()
	const { isTouched, resetField, setFieldValue, setUserAndDefaultValues } = useFieldActions()

	useEffect(() => {
		if (!isConnected) {
			return
		}

		if (!isTouched('fromChain') && !isTouched('fromToken')) {
			resetField('fromChain', { defaultValue: formDefaultValues.fromChain })
			setFieldValue('fromToken', '')
			if (isTouched('fromAmount')) {
				setFieldValue('fromAmount', '')
			}
		}
		if (!isTouched('toChain') && !isTouched('toToken')) {
			resetField('toChain', { defaultValue: formDefaultValues.toChain })
			setFieldValue('toToken', '')
		}
	}, [isConnected, isTouched, resetField, setFieldValue])

	useEffect(() => {
		setUserAndDefaultValues(accountForChainId(reactiveFormValues))
	}, [reactiveFormValues, setUserAndDefaultValues])

	return null
}

const accountForChainId = (defaultValues: Partial<DefaultValues>) => {
	const result: Partial<DefaultValues> = { ...defaultValues }
	for (const key in result) {
		const k = key as keyof DefaultValues
		if (result[k] === formDefaultValues[k]) {
			if (k === 'fromChain' || k === 'toChain') {
				result[k] = formDefaultValues[k]
			}
		}
	}
	return result
}
