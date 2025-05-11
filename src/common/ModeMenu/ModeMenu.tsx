import { memo, useCallback } from 'react'
import { useSubvariantStore } from '../../store/subvariant/useSubvariantStore'
import { SplitSubvariantType } from '../../store/subvariant/types'
import { ModeButton } from './ModeButton/ModeButton'
import './ModeMenu.pcss'

export const ModeMenu = memo((): JSX.Element => {
	const { state, setState } = useSubvariantStore()

	const handleSwapClick = useCallback(() => setState(SplitSubvariantType.SWAP), [setState])
	const handleSendClick = useCallback(() => setState(SplitSubvariantType.SEND), [setState])

	return (
		<div className="mode-menu-container" role="group" aria-label="Transaction mode selection">
			<ModeButton isActive={state === SplitSubvariantType.SWAP} onClick={handleSwapClick} text="Swap" />
			<ModeButton isActive={state === SplitSubvariantType.SEND} onClick={handleSendClick} text="Send" />
		</div>
	)
})
