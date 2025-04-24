import { FC, useCallback, memo, useMemo } from 'react'
import { useSplitSubvariantStore } from '../../store/subvariant/useSplitSubvariantStore'
import { ModeButton } from './ModeButton/ModeButton'
import './ModeMenu.pcss'

export const ModeMenu: FC = memo(() => {
	const { state, setState } = useSplitSubvariantStore()

	const handleSwapClick = useCallback(() => setState('swap'), [setState])
	const handleSendClick = useCallback(() => setState('send'), [setState])

	const buttons = useMemo(
		() => (
			<>
				<ModeButton isActive={state === 'swap'} onClick={handleSwapClick} text="Swap" />
				<ModeButton isActive={state === 'send'} onClick={handleSendClick} text="Send" />
			</>
		),
		[state, handleSwapClick, handleSendClick],
	)

	return <div className="mode-menu-container">{buttons}</div>
})
