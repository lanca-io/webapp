import type { FC } from 'react'
import { GasIcon } from '@/assets/GasIcon'
import { TimeIcon } from '@/assets/TimeIcon'
import { InfoTip } from '@/components/common/InfoTip'
import { useEstimateActionGas } from './useEstimateActionGas'
import { SkeletonLoader } from '@/components/common/SkeletonLoader'
import { format } from '@/utils/format'
import './InfoBoard.pcss'

export const InfoBoard: FC = () => {
	const { estimate, isLoading } = useEstimateActionGas()

	const gasDisplay = estimate ? format(estimate.usd, 2, '$') : '–'

	return (
		<div className="pool_action_info_board">
			<div className="pool_action_gas_info">
				<div className="pool_action_gas_info_description">
					<GasIcon color="var(--color-gray-500)" />
					<span className="pool_action_gas_info_text">Gas to pay</span>
				</div>
				{isLoading ? (
					<SkeletonLoader width={43} height={20} />
				) : (
					<span className="pool_action_gas_info_value">{gasDisplay}</span>
				)}
			</div>
			<div className="pool_action_eta_info">
				<div className="pool_action_eta_info_description">
					<TimeIcon color="var(--color-gray-500)" aria-hidden />
					<span className="pool_action_eta_info_text">Time</span>
				</div>
				<div className="pool_action_eta_info_container">
					<span
						className={`pool_action_eta_info_value ${isLoading ? 'pool_action_eta_info_value_loading' : ''}`}
					>
						20 sec
					</span>
					<span className="pool_action_eta_info_value">+</span>
					<span className="pool_action_eta_info_value">Queue</span>
					<InfoTip
						id="info-board-tooltip"
						description="Queue holds pending transactions waiting for sequential pool processing"
					/>
				</div>
			</div>
		</div>
	)
}
