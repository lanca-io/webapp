import { useEffect, useRef, useState, useCallback } from 'react'
import { IconButton } from '@concero/ui-kit'
import { SwapIcon } from '@/assets/SwapIcon'
import { useIsTablet, useIsMobile } from '@/hooks'
import { usePoolsActionContext } from '../../Reducer/Provider'
import { PoolsActionType, PoolsStateActions } from '../../Reducer/types'
import './Pointer.pcss'

export const Pointer = (): JSX.Element => {
	const { state, dispatch } = usePoolsActionContext()
	const [top, setTop] = useState<number>(0)
	const cardRef = useRef<HTMLElement | null>(null)
	const observerRef = useRef<ResizeObserver | null>(null)
	const isMobile = useIsMobile()
	const isTablet = useIsTablet()

	const handleSwap = useCallback(() => {
		if (state.type === PoolsActionType.DEPOSIT) {
			dispatch({
				type: PoolsStateActions.CHANGE_TYPE,
				payload: PoolsActionType.WITHDRAWAL,
			})
		} else {
			dispatch({
				type: PoolsStateActions.CHANGE_TYPE,
				payload: PoolsActionType.DEPOSIT,
			})
		}
	}, [dispatch, state.type])

	const setupObserver = useCallback(() => {
		const card = document.querySelector(
			'.pool_action_source_card',
		) as HTMLElement
		if (!card) return

		cardRef.current = card

		const updatePosition = () => {
			let offset: number

			if (isMobile) {
				offset = 32
			} else if (isTablet) {
				offset = 32
			} else {
				offset = 30
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
		<div
			className="pool_action_card_pointer"
			style={{ top: `${top}px` }}
			role="presentation"
		>
			<IconButton
				size="s"
				variant="secondary"
				className="pool_action_card_pointer_icon"
				onClick={handleSwap}
				aria-label="Swap chains and tokens"
			>
				<SwapIcon aria-hidden="true" />
			</IconButton>
		</div>
	)
}
