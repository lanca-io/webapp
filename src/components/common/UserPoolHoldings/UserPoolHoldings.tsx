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
import './UserPoolHoldings.pcss'

type LastDeposit = {
	timestamp: number
	amountUsd: number
}

type UserPoolHoldingsProps = {
	isLoading: boolean
	usdBalance: number
	lpBalance: number
	principal: number
	lastDeposit?: LastDeposit | null
}

export const UserPoolHoldings: FC<UserPoolHoldingsProps> = ({
	usdBalance,
	lpBalance,
	principal,
	lastDeposit,
	isLoading,
}) => {
	const { open } = useAppKit()
	const { isConnected, isConnecting } = useAccount()
	const [activeModal, setActiveModal] = useState<PoolsActionType | null>(null)

	const change = useMemo(() => {
		if (!Number.isFinite(usdBalance) || !Number.isFinite(principal)) return 0
		if (principal === 0) return 0
		const safeDenom = Math.max(Math.abs(principal), 0.0001)
		return ((usdBalance - principal) / safeDenom) * 100
	}, [usdBalance, principal])

	const changeStr = useMemo(() => {
		if (!Number.isFinite(change)) return '0%'
		const abs = Math.abs(change)
		const sign = change > 0 ? '+' : change < 0 ? '-' : ''
		return abs % 1 === 0
			? `${sign}${Math.round(abs)}%`
			: `${sign}${format(abs, 1)}%`
	}, [change])

	const showDeposit = useMemo(
		() =>
			!!lastDeposit &&
			Number.isFinite(lastDeposit.timestamp) &&
			Number.isFinite(lastDeposit.amountUsd) &&
			lastDeposit.timestamp > 0,
		[lastDeposit],
	)

	const depositStr = useMemo(
		() => (showDeposit ? getRelativeTime(lastDeposit!.timestamp) : null),
		[showDeposit, lastDeposit?.timestamp],
	)

	const usdStr = useMemo(() => format(usdBalance, 2), [usdBalance])
	const lpStr = useMemo(() => `= ${format(lpBalance, 2)} CLP`, [lpBalance])
	const showChangeTag = Number.isFinite(change) && change !== 0

	const openModal = (type: PoolsActionType) => setActiveModal(type)
	const closeModal = () => setActiveModal(null)

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
								<span className="user_pool_holding_amount">{usdStr}</span>
								{showChangeTag && (
									<Tag
										className="user_pool_holdings_tag"
										variant={change >= 0 ? 'positive' : 'negative'}
										size="s"
									>
										{changeStr}
									</Tag>
								)}
							</div>
						)}

						<div className="user_pool_holdings_lp">
							{isLoading ? <SkeletonLoader height={18} width={68} /> : lpStr}
						</div>
					</div>
					{!isLoading && showDeposit ? (
						<div className="user_pool_holdings_last_action">
							<span className="user_pool_holding_last_action_timestamp">
								{depositStr}
							</span>
							<span className="user_pool_holding_last_action_amount">
								Deposit {format(lastDeposit!.amountUsd, 2)} USDC
							</span>
						</div>
					) : null}
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

			{activeModal && (
				<PoolActionModal type={activeModal} onClose={closeModal} />
			)}
		</>
	)
}
