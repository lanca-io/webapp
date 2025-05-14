import { useEffect, useRef, useState, useCallback } from 'react'
import { IconButton } from '@concero/ui-kit'
import { ArrowDown } from '../../../assets/icons/ArrowDown'
import './CardPointer.pcss'

export const CardPointer = (): JSX.Element => {
	const [top, setTop] = useState<number>(0)
	const cardRef = useRef<HTMLElement | null>(null)
	const observerRef = useRef<ResizeObserver | null>(null)

	const setupObserver = useCallback(() => {
		const card = document.querySelector('.destination_card') as HTMLElement
		if (!card) return

		cardRef.current = card

		const updatePosition = () => {
			const position = card.offsetHeight + 235
			setTop(position)
		}

		updatePosition()
		const observer = new ResizeObserver(updatePosition)
		observerRef.current = observer
		observer.observe(card)

		return () => {
			observer.unobserve(card)
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
