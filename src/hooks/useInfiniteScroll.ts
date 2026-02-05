import { useRef, useCallback, useEffect } from 'react'

type Pagination = {
	take: number
	skip: number
}

export const useInfiniteScroll = (
	containerRef: React.RefObject<HTMLElement | null>,
	pagination: Pagination,
	setPagination: (newPagination: Pagination) => void,
	threshold = 0,
) => {
	const lastScrollTop = useRef(0)
	const hasReachedBottom = useRef(false)

	const handleScroll = useCallback(() => {
		if (!containerRef.current) return
		const { scrollTop, clientHeight, scrollHeight } = containerRef.current

		const scrollingDown = scrollTop > lastScrollTop.current
		const atBottom = scrollTop + clientHeight >= scrollHeight - threshold

		if (scrollingDown && atBottom) {
			if (!hasReachedBottom.current) {
				hasReachedBottom.current = true
				setPagination({
					take: pagination.take,
					skip: pagination.skip + pagination.take,
				})
			}
		} else if (!atBottom) {
			hasReachedBottom.current = false
		}

		lastScrollTop.current = scrollTop
	}, [containerRef, pagination, setPagination, threshold])

	useEffect(() => {
		const el = containerRef.current
		if (!el) return
		el.addEventListener('scroll', handleScroll)
		return () => el.removeEventListener('scroll', handleScroll)
	}, [handleScroll])
}
