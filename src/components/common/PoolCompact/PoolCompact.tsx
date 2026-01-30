import type { FC } from 'react'
import { useMemo, useState } from 'react'
import { abbreviateNumber } from '@/utils/format'
import { SkeletonLoader } from '../SkeletonLoader'
import { Heading } from './Heading'
import { Loader } from './Loader'
import { Info } from './Info'
import { Button } from '@concero/ui-kit'
import { PoolActionModal } from '../PoolActionModal/PoolActionModal'
import { PoolsActionType } from '../PoolActionModal/Reducer/types'
import { useNavigate } from 'react-router-dom'
import { routes } from '@/constants'
import './PoolCompact.pcss'

type PoolCompactProps = {
	isConnected: boolean
	isLoading: boolean
	cap: number | null
	tvl: number | null
	deposited: number
	earned?: number
}

export const PoolCompact: FC<PoolCompactProps> = ({
	isConnected,
	isLoading,
	tvl,
	deposited,
	cap,
}) => {
	const [isDepositOpen, setIsDepositOpen] = useState<boolean>(false)

	const navigate = useNavigate()

	const handleOpenClick = () => {
		navigate(routes.usdcPools)
	}

	const isActive = isConnected && deposited > 0
	const isFull = tvl !== null && cap !== null && tvl >= cap

	const handleDepositClick = () => {
		setIsDepositOpen(true)
	}

	const handleDepositClose = () => {
		setIsDepositOpen(false)
	}

	const heading = useMemo(
		() => <Heading isLoading={isLoading} isActive={isActive} isFull={isFull} />,
		[isLoading, isActive, isFull],
	)

	const loader = useMemo(
		() => <Loader cap={cap ?? 0} tvl={tvl ?? 0} isLoading={isLoading} />,
		[cap, tvl, isLoading],
	)

	const dataSkeleton = useMemo(
		() => (
			<SkeletonLoader width="100%" height={62} className="pool_compact_data" />
		),
		[],
	)

	const apyInfo = useMemo(
		() => (
			<Info
				value="-"
				label="APY"
				isLoading={false}
				tooltip={{
					show: true,
					description:
						'APY (Annual Percentage Yield) shows your potential annual return from rewards. It starts accruing only after your deposit is executed.',
				}}
			/>
		),
		[],
	)

	const tvlInfo = useMemo(
		() => (
			<Info
				value={abbreviateNumber(tvl ?? 0)}
				label="TVL"
				prefix="$"
				isLoading={tvl === null}
				isHighlighted={isFull}
				tooltip={{
					show: true,
					description:
						'Total Value Locked (TVL) is the amount of liquidity currently held in this pool by all users.',
				}}
			/>
		),
		[tvl, isFull],
	)

	const depositedInfo = useMemo(
		() => (
			<Info
				value={abbreviateNumber(deposited ?? 0)}
				label="Deposited"
				prefix="$"
				isLoading={false}
			/>
		),
		[deposited],
	)

	const earnedInfo = useMemo(
		() => <Info value="-" label="Earned" isLoading={false} />,
		[],
	)

	const connectedData = useMemo(
		() => (
			<>
				{depositedInfo}
				{earnedInfo}
			</>
		),
		[depositedInfo, earnedInfo],
	)

	const actions = useMemo(
		() =>
			!isLoading ? (
				<div className="pool_compact_actions">
					<Button
						size="l"
						variant="secondary_color"
						onClick={handleDepositClick}
					>
						Deposit
					</Button>
					<Button size="l" variant="secondary" onClick={handleOpenClick}>
						Open
					</Button>
				</div>
			) : (
				<div className="pool_compact_actions">
					<SkeletonLoader
						width="100%"
						height={48}
						className="pool_compact_button_skeleton"
					/>
					<SkeletonLoader
						width="100%"
						height={48}
						className="pool_compact_button_skeleton"
					/>
				</div>
			),
		[isLoading],
	)

	return (
		<>
			<div className="pool_compact">
				<div className="pool_compact_content">
					{heading}
					{loader}
					{isLoading || tvl === null || cap === null ? (
						dataSkeleton
					) : (
						<div className="pool_compact_data">
							{apyInfo}
							{tvlInfo}
							{isConnected && connectedData}
						</div>
					)}
				</div>
				{actions}
			</div>

			{isDepositOpen && (
				<PoolActionModal
					type={PoolsActionType.Deposit}
					onClose={handleDepositClose}
				/>
			)}
		</>
	)
}
