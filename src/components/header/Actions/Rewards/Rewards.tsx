import type { FC } from 'react'
import { Tooltip } from '@/components/common/Tooltip/Tooltip'
import { IconButton } from '@concero/ui-kit'
import { RewardsIcon } from '@/assets/Rewards'
import { externalRoutes } from '@/constants'
import './Rewards.pcss'

const rewardsTooltipId = 'rewards-tooltip'

type RewardsProps = {
	isOpen: boolean
}

export const Rewards: FC<RewardsProps> = ({ isOpen }): JSX.Element => {
	const tooltipContent: JSX.Element = (
		<div className="rewards_tooltip_content">
			<span className="rewards_tooltip_title">Rewards Portal</span>
			<span className="rewards_tooltip_description">
				Get rewarded for every swap and bridge — check your rewards in the
				portal.
			</span>
		</div>
	)

	return (
		<Tooltip
			tooltipId={rewardsTooltipId}
			tooltipContent={tooltipContent}
			place="top"
			className="rewards_tooltip"
			disabled={isOpen}
		>
			<IconButton
				variant="tetrary"
				size="m"
				onClick={() =>
					window.open(externalRoutes.rewards, '_blank', 'noopener,noreferrer')
				}
			>
				<RewardsIcon color="var(--color-gray-600)" />
			</IconButton>
		</Tooltip>
	)
}
