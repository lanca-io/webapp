import { IconButton } from '@concero/ui-kit'
import { RewardsIcon } from '@/assets/icons/Rewards'
import { externalRoutes } from '@/constants'

export const Rewards = (): JSX.Element => {
	return (
		<IconButton
			variant="tetrary"
			size="m"
			onClick={() => window.open(externalRoutes.rewards, '_blank', 'noopener,noreferrer')}
		>
			<RewardsIcon />
		</IconButton>
	)
}
