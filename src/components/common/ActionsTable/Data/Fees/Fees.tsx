import type { FC } from 'react'
import { PoolsActionType } from '@/components/common/PoolActionModal/Reducer/types'
import { usePoolsDataStore } from '@/store/pools-data/usePoolsDataStore'
import { formatUnits } from 'viem'
import './Fees.pcss'

type FeesProps = {
	type: PoolsActionType
	amount?: string | null
	processedAmount?: string | null
	processedLpAmount?: string | null
	withdrawnLpAmount?: string | null
}

export const Fees: FC<FeesProps> = ({
	type,
	amount,
	processedAmount,
	processedLpAmount,
	withdrawnLpAmount,
}) => {
	const { lpPrice } = usePoolsDataStore()
	const isDeposit = type === PoolsActionType.Deposit

	const hasDepositData = amount && processedAmount
	const hasWithdrawalData = processedLpAmount && withdrawnLpAmount

	if (!lpPrice || (isDeposit ? !hasDepositData : !hasWithdrawalData)) {
		return <span>-</span>
	}

	const raw = BigInt(isDeposit ? amount! : processedLpAmount!)
	const processed = BigInt(isDeposit ? processedAmount! : withdrawnLpAmount!)
	const feeUsdc = Math.abs(
		Number(formatUnits(raw - processed, 6)) * (isDeposit ? 1 : lpPrice),
	)

	return (
		<div className="actions_table_fees">
			<span className="actions_table_fees_value">
				-
				{feeUsdc.toLocaleString('en-US', {
					minimumFractionDigits: 2,
					maximumFractionDigits: 6,
				})}
			</span>
			<span className="actions_table_fees_denomination">USDC</span>
		</div>
	)
}
