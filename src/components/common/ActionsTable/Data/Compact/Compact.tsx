import type { FC } from 'react'
import { PoolsActionType } from '@/components/common/PoolActionModal/Reducer/types'
import { PoolActionStatus } from '@/store/pools-positions/types'
import { InfoTip } from '@/components/common/InfoTip'
import { Tag } from '@concero/ui-kit'
import { formatTimestamp } from '@/utils/time'
import { formatUnits } from 'viem'
import { usePoolsDataStore } from '@/store/pools-data/usePoolsDataStore'
import './Compact.pcss'

type CompactProps = {
	type: PoolsActionType
	status: PoolActionStatus
	completedAt: number | null
	amount?: string | null
	lpAmount?: string | null
	processedAmount?: string | null
	processedLpAmount?: string | null
	withdrawnLpAmount?: string | null
}

export const Compact: FC<CompactProps> = ({
	type,
	status,
	completedAt,
	amount,
	lpAmount,
	processedAmount,
	processedLpAmount,
	withdrawnLpAmount,
}) => {
	const isDeposit = type === PoolsActionType.Deposit
	const isQueued = status === PoolActionStatus.Queued
	const actionText = isDeposit ? 'Deposit' : 'Withdrawal'
	const timeText = formatTimestamp(completedAt)
	const isCompleted = !!completedAt

	const { lpPrice } = usePoolsDataStore()

	const denomination = isDeposit ? 'USDC' : 'CLP'
	const rawValue = isDeposit ? amount : lpAmount

	const parsedAmount = rawValue ? Number(formatUnits(BigInt(rawValue), 6)) : 0
	const sign = isDeposit ? '+' : '-'

	const hasFeeData =
		lpPrice &&
		((isDeposit && amount && processedAmount) ||
			(!isDeposit && processedLpAmount && withdrawnLpAmount))
	const rawFee = hasFeeData
		? BigInt(isDeposit ? amount! : processedLpAmount!)
		: 0n
	const processedFee = hasFeeData
		? BigInt(isDeposit ? processedAmount! : withdrawnLpAmount!)
		: 0n
	const feeUsdc = hasFeeData
		? Math.abs(
				Number(formatUnits(rawFee - processedFee, 6)) *
					(isDeposit ? 1 : lpPrice),
			)
		: 0

	return (
		<div className="actions_table_compact">
			<div className="actions_table_compact_column">
				<div className="actions_table_compact_row">
					<span className="actions_table_compact_action_text">
						{actionText}
					</span>
					{isQueued && <Tag size="s">Queued</Tag>}
					{isQueued && (
						<InfoTip
							id="queued-action"
							description="Queued action will update once batch processing begins"
						/>
					)}
				</div>
				<div className="actions_table_compact_row">
					{isCompleted ? (
						<span className="actions_table_compact_time_text">{timeText}</span>
					) : (
						<>
							<span className="actions_table_compact_eta_label">ETA:</span>
							<span className="actions_table_compact_eta_value">
								{timeText}
							</span>
						</>
					)}
				</div>
			</div>
			<div className="actions_table_compact_column">
				<div className="actions_table_compact_row_end">
					<div className="actions_table_compact_amount">
						<span className="actions_table_compact_amount_value">
							{sign}
							{parsedAmount.toLocaleString()}
						</span>
						<span className="actions_table_compact_amount_value">
							{denomination}
						</span>
					</div>
				</div>
				<div className="actions_table_compact_row_end">
					{feeUsdc > 0 ? (
						<div className="actions_table_compact_fees">
							<span className="actions_table_compact_fees_value">
								-
								{feeUsdc.toLocaleString('en-US', {
									minimumFractionDigits: 2,
									maximumFractionDigits: 6,
								})}
							</span>
							<span className="actions_table_compact_fees_value">USDC</span>
						</div>
					) : (
						<span className="actions_table_compact_fees_value">-</span>
					)}
				</div>
			</div>
		</div>
	)
}
