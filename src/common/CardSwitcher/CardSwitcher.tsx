import type { FC } from 'react'
import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { IconButton } from '@concero/ui-kit'
import { SwapIcon } from '../../assets/icons/SwapIcon'
import { useFormStore } from '../../store/form/useFormStore'
import './CardSwitcher.pcss'

export const CardSwitcher: FC = () => {
	const { swapChainsAndTokens } = useFormStore()
	const [top, setTop] = useState<number | null>(null)
	const cardRef = useRef<HTMLElement | null>(null)
	const observer = useRef<ResizeObserver | null>(null)

	const setupObserver = useCallback((onChange: (pos: number) => void) => {
		const card = document.querySelector('.source_card') as HTMLElement
		if (!card) return () => {}

		cardRef.current = card

		const updatePosition = () => {
			if (cardRef.current) {
				const position = cardRef.current.offsetHeight - 15
				onChange(position)
			}
		}

		updatePosition()
		const resizeObserver = new ResizeObserver(updatePosition)
		observer.current = resizeObserver

		resizeObserver.observe(card)

		return () => {
			if (cardRef.current) resizeObserver.unobserve(cardRef.current)
			resizeObserver.disconnect()
			observer.current = null
		}
	}, [])

	useEffect(() => {
		const cleanup = setupObserver(setTop)
		return cleanup
	}, [setupObserver])

	const handleSwap = useCallback(() => swapChainsAndTokens(), [swapChainsAndTokens])
	const icon = useMemo(() => <SwapIcon />, [])

	const button = useMemo(
		() => (
			<IconButton size="s" variant="secondary" className="card_switcher_icon" onClick={handleSwap}>
				{icon}
			</IconButton>
		),
		[handleSwap, icon],
	)

	return (
		<div className="card_switcher" style={top !== null ? { top: `${top}px` } : undefined}>
			{button}
		</div>
	)
}
