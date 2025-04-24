import { FC, useCallback, memo, useMemo } from 'react'
import { useSubvariantStore } from '../../store/subvariant/useSubvariantStore'
import { SplitSubvariantType } from '../../store/subvariant/types'
import { ModeButton } from './ModeButton/ModeButton'
import './ModeMenu.pcss'

export const ModeMenu: FC = memo(() => {
	const { state, setState } = useSubvariantStore()

	const handleSwapClick = useCallback(() => setState(SplitSubvariantType.SWAP), [setState])
	const handleSendClick = useCallback(() => setState(SplitSubvariantType.SEND), [setState])

	const buttons = useMemo(
		() => (
			<>
				<ModeButton isActive={state === SplitSubvariantType.SWAP} onClick={handleSwapClick} text="Swap" />
				<ModeButton isActive={state === SplitSubvariantType.SEND} onClick={handleSendClick} text="Send" />
			</>
		),
		[state, handleSwapClick, handleSendClick],
	)

	return <div className="mode-menu-container">{buttons}</div>
})
