import type { DefaultValues, FormStoreStore } from './types.js'
import type { PropsWithChildren } from 'react'
import type { FormRef } from './types'
import { useMemo, useRef } from 'react'
import { FormStoreContext } from './FormContext'
import { FormUpdater } from './useFormUpdater'
import { createFormStore, formDefaultValues } from './createFormStore'
import { useFormRef } from './useFormRef'

const initialiseDefaultValues = (
	defaultValues: Partial<DefaultValues>,
	fromAmount?: number | string,
	toAmount?: number | string,
	toAddress?: string,
) => ({
	...formDefaultValues,
	...defaultValues,
	fromAmount:
		(typeof fromAmount === 'number' ? fromAmount?.toPrecision() : fromAmount) || formDefaultValues.fromAmount,
	toAmount: (typeof toAmount === 'number' ? toAmount?.toPrecision() : toAmount) || formDefaultValues.toAmount,
	toAddress: toAddress || formDefaultValues.toAddress,
})

interface FormStoreProviderProps extends PropsWithChildren {
	formRef?: FormRef
	initialValues?: Partial<DefaultValues>
}

export const FormStoreProvider: React.FC<FormStoreProviderProps> = ({ children, formRef, initialValues = {} }) => {
	const storeRef = useRef<FormStoreStore | null>(null)

	const reactiveFormValues = useMemo(
		() => ({
			...initialValues,
		}),
		[initialValues],
	)

	if (!storeRef.current) {
		storeRef.current = createFormStore(
			initialiseDefaultValues(
				reactiveFormValues,
				initialValues.fromAmount,
				initialValues.toAmount,
				initialValues.toAddress,
			),
		)
	}

	useFormRef(storeRef.current, formRef)

	return (
		<FormStoreContext.Provider value={storeRef.current}>
			{children}
			<FormUpdater reactiveFormValues={reactiveFormValues} />
		</FormStoreContext.Provider>
	)
}
