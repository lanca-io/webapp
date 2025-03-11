import { useEffect } from 'react'
import { useAccount } from 'wagmi'
import { useTokensStore } from '../../store/tokens/useTokensStore'
import { useChainsStore } from '../../store/chains/useChainsStore'
import { useQuery } from '@tanstack/react-query'
import { handleFetchBalances, handleFetchTokens } from '../../handlers/tokens'

export const useLoadTokens = () => {
	const { address } = useAccount()
	const { selectedChain } = useChainsStore()
	// const { tokens, setTokens, setLoading, setError } = useTokensStore()

	const fetchTokensAndBalances = async () => {
		if (!selectedChain || !address) return []

		const [tokens] = await Promise.all([
			// handleFetchTokens(selectedChain.id, 0, 15, '', address),
			handleFetchBalances(selectedChain.id, address),
		])

		return { tokens }
	}

	const { data, isLoading, error } = useQuery({
		queryKey: ['tokensAndBalances', selectedChain?.id, address],
		queryFn: fetchTokensAndBalances,
		enabled: !!selectedChain && !!address,
	})

	// useEffect(() => {
	//     if (data) {
	//         setTokens(data)
	//     }
	//     if (isLoading) {
	//         setLoading(true)
	//     } else {
	//         setLoading(false)
	//     }
	//     if (error) {
	//         setError(error.message)
	//     }
	// }, [data, isLoading, error, setTokens, setLoading, setError])

	return { fetchTokensAndBalances, isLoading, error }
}
