import { useEffect, useCallback, useRef, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAccount } from 'wagmi'
import { usePoolsPositions } from '@/store/pools-positions/usePoolsPositionsStore'

export const useLoadUserActions = () => {
	const { address } = useAccount()
	const {
		actions,
		initialActionsLoading,
		dataActionsLoading,
		actionsPagination,
		setActions,
		setActionsLoading,
		setActionsPagination,
		resetActions,
	} = usePoolsPositions()

	const { take, skip } = actionsPagination
	const initialLoad = useMemo(() => skip === 0, [skip])
	const hasMore = useRef(true)

	const getUserActionsData = useCallback(async () => {
		if (!address) return null

		const params = {
			address,
			is_testnet: true,
			take,
			skip,
		}

		const url = new URL('https://dev.concero.io/api/v1/pools/actions')
		Object.entries(params).forEach(([key, value]) => {
			url.searchParams.append(key, String(value))
		})

		const response = await fetch(url.toString(), {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' },
		})

		if (!response.ok) {
			throw new Error(`User actions fetch failed: ${response.status}`)
		}

		const json = await response.json()
		return json.payload?.data ?? []
	}, [address, take, skip])

	const {
		data,
		isLoading: queryLoading,
		refetch,
	} = useQuery({
		queryKey: ['poolsUserActions', address, take, skip],
		queryFn: getUserActionsData,
		enabled: !!address,
		staleTime: 5 * 60_000,
		retry: 2,
		refetchOnWindowFocus: false,
		retryDelay: attempt => Math.min(1000 * 2 ** attempt, 30000),
		retryOnMount: false,
		refetchOnReconnect: false,
		refetchOnMount: false,
	})

	useEffect(() => {
		if (!data) return
		hasMore.current = data.length === take
	}, [data, take])

	useEffect(() => {
		setActionsLoading(queryLoading, initialLoad)
	}, [queryLoading, initialLoad, setActionsLoading])

	useEffect(() => {
		if (!data || data.length === 0) return
		if (initialLoad) {
			setActions(data)
		} else {
			setActions([...actions, ...data])
		}
	}, [data, initialLoad, setActions])

	useEffect(() => {
		if (!address) return
		setActionsPagination({ take: 20, skip: 0 })
		resetActions()
		hasMore.current = true
	}, [address, setActionsPagination, resetActions])

	return {
		loading: initialActionsLoading || dataActionsLoading,
		refetch,
		data,
		hasMore: hasMore.current,
	}
}
