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
			return url.toString()
		},
		[],
	)

	const fetchUserActions = useCallback(async () => {
		if (!address) return null

		const url = buildUrl(address, take, skip)
		const response = await fetch(url, {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' },
		})

		if (!response.ok) {
			throw new Error(`User actions fetch failed: ${response.status}`)
		}

		const json = await response.json()
		return json.payload?.data ?? []
	}, [address, take, skip, buildUrl])

	const {
		data,
		isLoading: queryLoading,
		refetch,
	} = useQuery({
		queryKey: ['poolsUserActions', address, take, skip],
		queryFn: fetchUserActions,
		enabled: !!address,
		staleTime: 5 * 60_000,
		retry: 2,
		refetchOnWindowFocus: false,
		refetchOnReconnect: false,
		refetchOnMount: false,
		retryDelay: attempt => Math.min(1000 * 2 ** attempt, 30000),
	})

	useEffect(() => {
		if (data) {
			hasMore.current = data.length === take
		}
	}, [data, take])

	useEffect(() => {
		setActionsLoading(queryLoading, initialLoad)
	}, [queryLoading, initialLoad, setActionsLoading])

	useEffect(() => {
		if (!data?.length) return

		if (initialLoad) {
			setActions(data)
		} else {
			addActions(data)
		}
	}, [data, initialLoad, setActions, addActions])

	useEffect(() => {
		if (!address) {
			resetActions()
			hasMore.current = true
			return
		}

		setActionsPagination({ take: 20, skip: 0 })
		resetActions()
		hasMore.current = true
	}, [address, setActionsPagination, resetActions])

	return {
		refetch,
	}
}
