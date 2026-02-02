import type { FC } from 'react'
import { useMemo, useState } from 'react'
import { Button, Tag } from '@concero/ui-kit'
import { format } from '@/utils/format'
import { getRelativeTime } from '@/utils/time'
import { SkeletonLoader } from '../SkeletonLoader'
import { useAppKit } from '@reown/appkit/react'
import { useAccount } from 'wagmi'
import { PoolActionModal } from '../PoolActionModal/PoolActionModal'
import { PoolsActionType } from '../PoolActionModal/Reducer/types'
import { usePoolsDataStore } from '@/store/pools-data/usePoolsDataStore'
import './UserPoolHoldings.pcss'

type LastDeposit = {
	timestamp: number
	amountUsd: number
}

type UserPoolHoldingsProps = {
	isLoading: boolean
	lpBalance: number | null
	principal: number | null
	lastDeposit?: LastDeposit | null
}

export const UserPoolHoldings: FC<UserPoolHoldingsProps> = ({
	lpBalance,
	principal,
	lastDeposit,
	isLoading,
}) => {
	const [modal, setModal] = useState<PoolsActionType | null>(null)

	const { open } = useAppKit()
	const { lpPrice } = usePoolsDataStore()
	const { isConnected, isConnecting } = useAccount()

	const value = useMemo(() => {
		const lp = lpBalance ?? 0
		const price = lpPrice ?? 0
		return lp > 0 && price > 0 ? lp * price : 0
	}, [lpBalance, lpPrice])

	const pnl = useMemo(() => {
		const p = principal ?? 0
		return p === 0 ? 0 : ((value - p) / Math.abs(p)) * 100
	}, [value, principal])

	const deposit = lastDeposit && lastDeposit.timestamp > 0 ? lastDeposit : null

	const openModal = (type: PoolsActionType) => setModal(type)
	const closeModal = () => setModal(null)

	if (!isConnected) {
		return (
			<div className="user_pool_holdings_disconnected">
				<span className="user_pool_holdings_disconnected_title">
					Please connect your wallet to view your pool holdings.
				</span>
				<Button
					variant="primary"
					size="l"
					isDisabled={isConnecting}
					isLoading={isConnecting}
					onClick={() => open()}
				>
					Connect Wallet
				</Button>
			</div>
		)
	}

	return (
		<>
			<div className="user_pool_holdings">
				<div className="user_pool_holdings_container">
					<span className="user_pool_holdings_title">Total Value</span>
					<div className="user_pool_holdings_content">
						{isLoading ? (
							<SkeletonLoader
								height={68}
								width={243}
								className="user_pool_holdings_value_skeleton"
							/>
						) : (
							<div className="user_pool_holdings_value">
								<span className="user_pool_holding_denomination">USDC</span>
								<span className="user_pool_holding_amount">
									{format(value, 2)}
								</span>
								{pnl !== 0 && (
									<Tag
										className="user_pool_holdings_tag"
										variant={pnl >= 0 ? 'positive' : 'negative'}
										size="s"
									>
										{(() => {
											const abs = Math.abs(pnl)
											const sign = pnl > 0 ? '+' : pnl < 0 ? '-' : ''
											return abs % 1 === 0
												? `${sign}${Math.round(abs)}%`
												: `${sign}${format(abs, 1)}%`
										})()}
									</Tag>
								)}
							</div>
						)}
						<div className="user_pool_holdings_lp">
							{isLoading ? (
								<SkeletonLoader height={18} width={68} />
							) : (
								`= ${format(lpBalance ?? 0, 2)} CLP`
							)}
						</div>
					</div>
					{deposit && !isLoading && (
						<div className="user_pool_holdings_last_action">
							<span className="user_pool_holding_last_action_timestamp">
								{getRelativeTime(deposit.timestamp)}
							</span>
							<span className="user_pool_holding_last_action_amount">
								Deposit {format(deposit.amountUsd, 2)} USDC
							</span>
						</div>
					)}
				</div>
				<div className="user_pool_holdings_actions">
					{isLoading ? (
						<>
							<SkeletonLoader height={48} className="button_skeleton" />
							<SkeletonLoader height={48} className="button_skeleton" />
						</>
					) : (
						<>
							<Button
								variant="primary"
								size="l"
								onClick={() => openModal(PoolsActionType.Deposit)}
							>
								Add More
							</Button>
							<Button
								variant="secondary_color"
								size="l"
								onClick={() => openModal(PoolsActionType.Withdraw)}
							>
								Withdraw
							</Button>
						</>
					)}
				</div>
			</div>

			{modal && (
				<PoolActionModal key={modal} type={modal} onClose={closeModal} />
			)}
		</>
	)
}
