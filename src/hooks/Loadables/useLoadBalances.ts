import { useEffect, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { handleFetchBalances } from '../../handlers/tokens'
import { useBalancesStore } from '../../store/balances/useBalancesStore'
import { useFormStore } from '../../store/form/useFormStore'
import { useAccount } from 'wagmi'
import type { ExtendedToken } from '../../store/tokens/types'

export const useLoadBalances = () => {
	const { address } = useAccount()
	const { srcChain, dstChain } = useFormStore()
	const { setSrcBalances, setDstBalances, setLoadingSrcBalances, setLoadingDstBalances } = useBalancesStore()

	const fetchBalances = async (
		chainId: string,
		setLoading: (isLoading: boolean) => void,
	): Promise<ExtendedToken[]> => {
		if (!address) return []
		setLoading(true)
		try {
			const balances = await handleFetchBalances(chainId, address)
			if (balances && balances[chainId]) {
				return balances[chainId].map(({ _id, ...tokenData }) => ({
					...tokenData,
					chain_id: chainId,
				}))
			}
			return []
		} catch (error) {
			console.error(error)
			return []
		} finally {
			setLoading(false)
		}
	}

	const fetchSourceBalances = useMemo(
		() => () => fetchBalances(srcChain?.id!, setLoadingSrcBalances),
		[srcChain, address],
	)
	const fetchDestinationBalances = useMemo(
		() => () => fetchBalances(dstChain?.id!, setLoadingDstBalances),
		[dstChain, address],
	)

	const { data: srcBalancesData } = useQuery({
		queryKey: ['srcBalances', srcChain?.id, address],
		queryFn: fetchSourceBalances,
		enabled: !!srcChain && !!address,
	})

	const { data: dstBalancesData } = useQuery({
		queryKey: ['dstBalances', dstChain?.id, address],
		queryFn: fetchDestinationBalances,
		enabled: !!dstChain && !!address,
	})

	useEffect(() => {
		if (srcBalancesData) {
			setSrcBalances(srcBalancesData)
		}
	}, [srcBalancesData, setSrcBalances])

	useEffect(() => {
		if (dstBalancesData) {
			setDstBalances(dstBalancesData)
		}
	}, [dstBalancesData, setDstBalances])
}
