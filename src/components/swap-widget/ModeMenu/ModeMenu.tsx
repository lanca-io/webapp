import { FC, useCallback, memo } from 'react'
import { useSplitSubvariantStore } from '../../../store/subvariant/useSplitSubvariantStore'
import classNames from './ModeMenu.module.pcss'

const ModeButton: FC<{ isActive: boolean; onClick: () => void; text: string }> = ({ isActive, onClick, text }) => (
	<button className={`${classNames['mode-menu__button']} ${isActive ? classNames['active'] : ''}`} onClick={onClick}>
		{text}
	</button>
)

export const ModeMenu: FC = memo(() => {
	const { state, setState } = useSplitSubvariantStore()

	const handleSwapClick = useCallback(() => setState('swap'), [setState])
	const handleSendClick = useCallback(() => setState('send'), [setState])

	return (
		<div className={classNames['mode-menu-container']}>
			<ModeButton isActive={state === 'swap'} onClick={handleSwapClick} text="Swap" />
			<ModeButton isActive={state === 'send'} onClick={handleSendClick} text="Send" />
		</div>
	)
})
