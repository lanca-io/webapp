import { useEffect, useCallback, useRef, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAccount } from 'wagmi'
import { usePoolsPositions } from '@/store/pools-positions/usePoolsPositionsStore'

export const useLoadUserActions = () => {
	const { address } = useAccount()

	const {
		actionsPagination,
		setActions,
		addActions,
		setActionsLoading,
		setActionsPagination,
		resetActions,
	} = usePoolsPositions()

	const { take, skip } = actionsPagination
	const initialLoad = useMemo(() => skip === 0, [skip])
	const hasMore = useRef(true)

	const buildUrl = useCallback(
		(address: string, take: number, skip: number) => {
			const url = new URL('https://dev.concero.io/api/v1/pools/actions')
			url.searchParams.append('address', address)
			url.searchParams.append('is_testnet', 'true')
			url.searchParams.append('take', String(take))
			url.searchParams.append('skip', String(skip))
			return url.toString()
		},
		[],
	)

	const fetchUserActions = useCallback(async () => {
		if (!address) return null

		const response = await fetch(buildUrl(address, take, skip), {
			headers: { 'Content-Type': 'application/json' },
		})

		if (!response.ok) {
			throw new Error(`User actions fetch failed: ${response.status}`)
		}

		const { payload } = await response.json()
		return payload?.data ?? []
	}, [address, take, skip, buildUrl])

	const {
		data,
		isLoading: queryLoading,
		refetch,
	} = useQuery({
		queryKey: ['poolsUserActions', address, take, skip],
		queryFn: fetchUserActions,
		enabled: !!address,
		placeholderData: [],
		staleTime: 0,
		retry: 2,
		refetchOnWindowFocus: false,
		refetchOnReconnect: true,
		refetchOnMount: true,
		retryDelay: attempt => Math.min(1000 * 2 ** attempt, 30000),
	})

	useEffect(() => {
		if (data) hasMore.current = data.length === take
	}, [data, take])

	useEffect(() => {
		setActionsLoading(queryLoading, initialLoad)
	}, [queryLoading, initialLoad, setActionsLoading])

	useEffect(() => {
		if (!data?.length) return

		initialLoad ? setActions(data) : addActions(data)
	}, [data, initialLoad, setActions, addActions])

	useEffect(() => {
		if (!address) {
			resetActions()
			hasMore.current = true
			return
		}
		setActionsPagination({ take: 20, skip: 0 })
	}, [address, setActionsPagination, resetActions])

	return { refetch, hasMore: hasMore.current }
}
