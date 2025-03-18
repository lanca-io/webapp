import type { FC } from 'react'
import { IconButton } from '../../layout/buttons/IconButton/IconButton'
import { SwapIcon } from '../../../assets/icons/SwapIcon'
import { useFormStore } from '../../../store/form/useFormStore'
import classNames from './CardSwitcher.module.pcss'

export const CardSwitcher: FC = () => {
	const { swapChainsAndTokens } = useFormStore()

	return (
		<div className={classNames['switcher']}>
			<div className={classNames['switcher-separator']} />
			<IconButton
				size="sm"
				variant="secondary"
				className={classNames['switcher-icon']}
				onClick={() => swapChainsAndTokens()}
			>
				<SwapIcon />
			</IconButton>
			<div className={classNames['switcher-separator']} />
		</div>
	)
}
