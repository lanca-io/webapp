import { useEffect, useRef, useState, useCallback } from 'react'
import { IconButton } from '@concero/ui-kit'
import { ArrowDown } from '../../../assets/icons/ArrowDown'
import './CardPointer.pcss'

export const CardPointer = (): JSX.Element => {
	const [top, setTop] = useState<number>(0)
	const srcRef = useRef<HTMLElement | null>(null)
	const dstRef = useRef<HTMLElement | null>(null)
	const observerRef = useRef<ResizeObserver | null>(null)

	const setupObserver = useCallback(() => {
		const src_card = document.querySelector('.source_card') as HTMLElement
		const dst_card = document.querySelector('.destination_card') as HTMLElement
		if (!src_card || !dst_card) return

		srcRef.current = src_card
		dstRef.current = dst_card

		const updatePosition = () => {
			const srcBottom = src_card.offsetHeight + 60
			const dstTop = dst_card.offsetHeight + 5
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
	}, [])

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
