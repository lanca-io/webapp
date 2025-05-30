import { useCallback, useRef, useEffect } from 'react'

type ScrollOptions = {
	disabled: boolean
	onLoadMore: () => void
	threshold?: number
}

export const useInfiniteScroll = ({ disabled, onLoadMore, threshold = 1 }: ScrollOptions) => {
	const ref = useRef<HTMLDivElement>(null)

	const checkScroll = useCallback(() => {
		if (disabled || !ref.current) return

		const el = ref.current
		const atBottom = Math.abs(el.scrollHeight - el.scrollTop - el.clientHeight) < threshold

		if (atBottom) {
			onLoadMore()
		}
	}, [disabled, onLoadMore, threshold])

	useEffect(() => {
		const el = ref.current
		if (!el) return

		el.addEventListener('scroll', checkScroll)
		return () => el.removeEventListener('scroll', checkScroll)
	}, [checkScroll])

	return { ref }
}
