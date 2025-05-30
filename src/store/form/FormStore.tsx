import type { PropsWithChildren } from 'react'
import type { FormStore } from './types'
import { useRef } from 'react'
import { CreateFormStore } from './CreateFormStore'
import { FormContext } from './FormContext'

export function FormStoreProvider({ children }: PropsWithChildren<{}>) {
	const storeRef = useRef<FormStore>()
	if (!storeRef.current) {
		storeRef.current = CreateFormStore()
	}
	return <FormContext.Provider value={storeRef.current}>{children}</FormContext.Provider>
}
