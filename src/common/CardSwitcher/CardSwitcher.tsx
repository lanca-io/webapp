import type { FC } from 'react'
import { memo, useCallback } from 'react'
import { IconButton } from '@concero/ui-kit'
import { SwapIcon } from '../../assets/icons/SwapIcon'
import { useFormStore } from '../../store/form/useFormStore'
import './CardSwitcher.pcss'

export const CardSwitcher: FC = memo(() => {
	const { swapChainsAndTokens } = useFormStore()

	const handleSwap = useCallback(() => swapChainsAndTokens(), [swapChainsAndTokens])

	return (
		<div className="card_switcher">
			<div className="card_switcher_separator" />
			<IconButton size="s" variant="secondary" className="card_switcher_icon" onClick={handleSwap}>
				<SwapIcon />
			</IconButton>
			<div className="card_switcher_separator" />
		</div>
	)
})
