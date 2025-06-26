import { useEffect, useRef, useState, useCallback } from 'react'
import { IconButton } from '@concero/ui-kit'
import { ArrowDown } from '../../../assets/icons/ArrowDown'
import { useIsMobile, useIsTablet } from '../../../hooks/useMediaQuery'
import './CardPointer.pcss'

export const CardPointer = (): JSX.Element => {
	const [top, setTop] = useState<number>(0)
	const srcRef = useRef<HTMLElement | null>(null)
	const dstRef = useRef<HTMLElement | null>(null)
	const observerRef = useRef<ResizeObserver | null>(null)
	const isMobile = useIsMobile()
	const isTablet = useIsTablet()

	const setupObserver = useCallback(() => {
		const src_card = document.querySelector('.source_card') as HTMLElement
		const dst_card = document.querySelector('.destination_card') as HTMLElement
		if (!src_card || !dst_card) return

		srcRef.current = src_card
		dstRef.current = dst_card

		const updatePosition = () => {
			let srcOffset: number

			if (isMobile) {
				srcOffset = 45
			} else if (isTablet) {
				srcOffset = 60
			} else {
				srcOffset = 60
			}

			const srcBottom = src_card.offsetHeight + srcOffset
			const dstTop = dst_card.offsetHeight + 2
			const position = srcBottom + dstTop
			setTop(position)
		}

		updatePosition()

		const observer = new ResizeObserver(updatePosition)
		observerRef.current = observer
		observer.observe(src_card)
		observer.observe(dst_card)

		return () => {
			observer.unobserve(src_card)
			observer.unobserve(dst_card)
			observer.disconnect()
		}
	}, [isMobile, isTablet])

	useEffect(() => {
		const cleanup = setupObserver()
		return cleanup
	}, [setupObserver])

	return (
		<div className="card_pointer" style={{ top: `${top}px` }} role="presentation">
			<IconButton size="s" variant="secondary" className="card_pointer_icon" aria-label="Swap chains and tokens">
				<ArrowDown aria-hidden="true" />
			</IconButton>
		</div>
	)
}
