import { useEffect, useState } from 'react'
import type { Address } from 'viem'
import { isAddress } from 'viem'
import { ensClient } from '../configuration/ens'

type ENSResult = {
	name: string | null
	address: Address | null
	isLoading: boolean
	error: Error | null
}

export function useENS(input?: string | Address): ENSResult {
	const [result, setResult] = useState<ENSResult>({
		name: null,
		address: null,
		isLoading: false,
		error: null,
	})

	useEffect(() => {
		const resolveENS = async () => {
			setResult(prev => ({ ...prev, isLoading: true, error: null }))

			try {
				if (!input) {
					setResult({ name: null, address: null, isLoading: false, error: null })
					return
				}

				if (isAddress(input)) {
					const name = await ensClient.getEnsName({ address: input as Address })
					setResult({ name, address: null, isLoading: false, error: null })
				} else if (input.includes('.')) {
					const address = await ensClient.getEnsAddress({ name: input })
					setResult({ name: null, address, isLoading: false, error: null })
				}
			} catch (error) {
				setResult({
					name: null,
					address: null,
					isLoading: false,
					error: error as Error,
				})
			}
		}

		resolveENS()
	}, [input])

	return result
}
