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
	usdBalance: number | null
	lpBalance: number | null
	principal: number | null
	lastDeposit?: LastDeposit | null
}

export const UserPoolHoldings: FC<UserPoolHoldingsProps> = ({
	usdBalance,
	lpBalance,
	principal,
	lastDeposit,
	isLoading,
}) => {
	const [activeModal, setActiveModal] = useState<PoolsActionType | null>(null)

	const { open } = useAppKit()
	const { lpPrice } = usePoolsDataStore()
	const { isConnected, isConnecting } = useAccount()

	const holdings = useMemo(() => {
		if (
			Number.isFinite(lpBalance ?? 0) &&
			Number.isFinite(lpPrice ?? 0) &&
			(lpBalance ?? 0) > 0 &&
			(lpPrice ?? 0) > 0
		) {
			return (lpBalance ?? 0) * (lpPrice ?? 0)
		}
		return Number.isFinite(usdBalance ?? 0) ? usdBalance! : 0
	}, [lpBalance, lpPrice, usdBalance])

	const pnlPercent = useMemo(() => {
		if (
			!Number.isFinite(holdings) ||
			!Number.isFinite(principal ?? 0) ||
			(principal ?? 0) === 0
		)
			return 0
		const safeDenom = Math.max(Math.abs(principal!), 0.0001)
		return ((holdings - (principal ?? 0)) / safeDenom) * 100
	}, [holdings, principal])

	const pnlText = useMemo(() => {
		if (!Number.isFinite(pnlPercent)) return '0%'
		const abs = Math.abs(pnlPercent)
		const sign = pnlPercent > 0 ? '+' : pnlPercent < 0 ? '-' : ''
		return abs % 1 === 0
			? `${sign}${Math.round(abs)}%`
			: `${sign}${format(abs, 1)}%`
	}, [pnlPercent])

	const holdingsText = useMemo(() => format(holdings ?? 0, 2), [holdings])
	const lpTokensText = useMemo(
		() => `= ${format(lpBalance ?? 0, 2)} CLP`,
		[lpBalance],
	)
	const showPnlTag = Number.isFinite(pnlPercent) && pnlPercent !== 0

	const safeDeposit = useMemo(() => {
		if (
			!lastDeposit ||
			!Number.isFinite(lastDeposit.timestamp) ||
			!Number.isFinite(lastDeposit.amountUsd) ||
			lastDeposit.timestamp <= 0
		) {
			return null
		}
		return lastDeposit
	}, [lastDeposit])

	const depositTimeText = useMemo(
		() => (safeDeposit ? getRelativeTime(safeDeposit.timestamp) : null),
		[safeDeposit],
	)

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
								<span className="user_pool_holding_amount">{holdingsText}</span>
								{showPnlTag && (
									<Tag
										className="user_pool_holdings_tag"
										variant={pnlPercent >= 0 ? 'positive' : 'negative'}
										size="s"
									>
										{pnlText}
									</Tag>
								)}
							</div>
						)}
						<div className="user_pool_holdings_lp">
							{isLoading ? (
								<SkeletonLoader height={18} width={68} />
							) : (
								lpTokensText
							)}
						</div>
					</div>
					{safeDeposit && !isLoading && (
						<div className="user_pool_holdings_last_action">
							<span className="user_pool_holding_last_action_timestamp">
								{depositTimeText}
							</span>
							<span className="user_pool_holding_last_action_amount">
								Deposit {format(safeDeposit.amountUsd, 2)} USDC
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

			{activeModal && (
				<PoolActionModal
					key={activeModal}
					type={activeModal}
					onClose={closeModal}
				/>
			)}
		</>
	)
}
