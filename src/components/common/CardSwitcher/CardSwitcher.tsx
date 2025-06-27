import { useEffect, useRef, useState, useCallback } from 'react'
import { IconButton } from '@concero/ui-kit'
import { SwapIcon } from '../../../assets/icons/SwapIcon'
import { useFormStore } from '../../../store/form/useFormStore'
import { useIsMobile, useIsTablet } from '../../../hooks/useMediaQuery'
import './CardSwitcher.pcss'

export const CardSwitcher = (): JSX.Element => {
	const { swap } = useFormStore()
	const [top, setTop] = useState<number>(0)
	const cardRef = useRef<HTMLElement | null>(null)
	const observerRef = useRef<ResizeObserver | null>(null)
	const isMobile = useIsMobile()
	const isTablet = useIsTablet()

	const handleSwap = useCallback(() => {
		swap()
	}, [swap])

	const setupObserver = useCallback(() => {
		const card = document.querySelector('.source_card') as HTMLElement
		if (!card) return

		cardRef.current = card

		const updatePosition = () => {
			let offset: number

			if (isMobile) {
				offset = 58
			} else if (isTablet) {
				offset = 43
			} else {
				offset = 60
			}

			const position = card.offsetHeight + offset
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
	}, [isMobile, isTablet])

	useEffect(() => {
		const cleanup = setupObserver()
		return cleanup
	}, [setupObserver])

	return (
		<div className="card_switcher" style={{ top: `${top}px` }} role="presentation">
			<IconButton
				size="s"
				variant="secondary"
				className="card_switcher_icon"
				onClick={handleSwap}
				aria-label="Swap chains and tokens"
			>
				<SwapIcon aria-hidden="true" />
			</IconButton>
		</div>
	)
}
