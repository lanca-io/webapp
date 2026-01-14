import type { FC } from 'react'
import { useMemo } from 'react'
import { SkeletonLoader } from '../SkeletonLoader'
import { Heading } from './Heading'
import { Loader } from './Loader'
import { Info } from './Info'
import { Button } from '@concero/ui-kit'
import './PoolCompact.pcss'

type PoolCompactProps = {
	isConnected: boolean
	isLoading: boolean
	cap: number
	tvl: number
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
	const isActive: boolean = isConnected && deposited > 0
	const isFull: boolean = tvl >= cap

	const heading = useMemo(
		() => <Heading isLoading={isLoading} isActive={isActive} isFull={isFull} />,
		[isLoading, isActive, isFull],
	)

	const loader = useMemo(
		() => <Loader cap={cap} tvl={tvl} isLoading={isLoading} />,
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
				value={tvl}
				label="TVL"
				prefix="$"
				isLoading={false}
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
				value={deposited ?? 0}
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
					<Button size="l" variant="secondary_color">
						Deposit
					</Button>
					<Button size="l" variant="secondary">
						Open
					</Button>
				</div>
			) : (
				<div className="pool_compact_actions">
					<SkeletonLoader
						width={'100%'}
						height={48}
						className="pool_compact_button_skeleton"
					/>
					<SkeletonLoader
						width={'100%'}
						height={48}
						className="pool_compact_button_skeleton"
					/>
				</div>
			),
		[isLoading],
	)

	return (
		<div className="pool_compact">
			<div className="pool_compact_content">
				{heading}
				{loader}
				{isLoading ? (
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
	)
}
