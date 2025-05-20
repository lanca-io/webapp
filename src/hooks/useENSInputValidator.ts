import type { Address } from 'viem'
import { useCallback, useMemo, useEffect, useState } from 'react'
import { useFormStore } from '../store/form/useFormStore'
import { ensClient } from '../configuration/ens'
import { useDebounce } from './useDebounce'

export const useEnsInputValidator = (value: string) => {
	const { setAddressInputError, setToAddress } = useFormStore()
	const [resolvedAddress, setResolvedAddress] = useState<Address | null>(null)
	const debouncedValue = useDebounce(value, 500)

	const validation = useMemo(() => {
		if (!debouncedValue.trim()) {
			return { valid: false, errorMessage: null, resolvedAddress: null }
		}

		if (!/^([a-zA-Z0-9-]+\.)+[a-z]{2,}$/.test(debouncedValue)) {
			return {
				valid: false,
				errorMessage: 'Invalid ENS format',
				resolvedAddress: null,
			}
		}

		return {
			valid: !!resolvedAddress,
			errorMessage: resolvedAddress ? null : 'Invalid ENS name',
			resolvedAddress,
		}
	}, [debouncedValue, resolvedAddress])

	useEffect(() => {
		let isMounted = true

		const resolveENS = async () => {
			try {
				const address = await ensClient.getEnsAddress({ name: debouncedValue })
				if (isMounted) setResolvedAddress(address)
			} catch {
				if (isMounted) setResolvedAddress(null)
			}
		}

		if (validation.errorMessage === 'Invalid ENS format') return
		resolveENS()

		return () => {
			isMounted = false
		}
	}, [debouncedValue])

	return useCallback(() => {
		setAddressInputError(validation.errorMessage)
		setToAddress(validation.resolvedAddress)
	}, [validation, setAddressInputError, setToAddress])
}
