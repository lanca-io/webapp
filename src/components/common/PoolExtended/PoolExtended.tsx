import type { FC } from 'react'
import { useMemo } from 'react'
import { Heading } from './Heading/Heading'
import { Info } from './Info/Info'
import { Button } from '@concero/ui-kit'
import { SkeletonLoader } from '../SkeletonLoader'
import './PoolExtended.pcss'

type PoolExtendedProps = {
	isConnected: boolean
	isLoading: boolean
	cap: number
	tvl: number
	deposited: number
	earned?: number
}

export const PoolExtended: FC<PoolExtendedProps> = ({
	isConnected,
	isLoading,
	tvl,
	deposited,
	cap,
}) => {
	const isActive = isConnected && deposited > 0
	const isFull = tvl >= cap

	const heading = useMemo(
		() => <Heading isLoading={isLoading} isActive={isActive} isFull={isFull} />,
		[isLoading, isActive, isFull],
	)

	const apyInfo = useMemo(
		() => (
			<Info
				value="-"
				label="APY"
				isLoading={isLoading}
				tooltip={{
					show: true,
					description:
						'APY (Annual Percentage Yield) shows your potential annual return from rewards.',
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
				isLoading={isLoading}
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
				isLoading={isLoading}
			/>
		),
		[deposited],
	)

	const earnedInfo = useMemo(
		() => <Info value="-" label="Earned" isLoading={isLoading} />,
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
				<div className="pool_extended_actions">
					<Button variant="secondary_color" size="m" isDisabled={isFull}>
						Deposit
					</Button>
					<Button variant="secondary" size="m">
						Open
					</Button>
				</div>
			) : (
				<div className="pool_extended_actions">
					<SkeletonLoader width={90.5} height={38} />
					<SkeletonLoader width={90.5} height={38} />
				</div>
			),
		[isLoading, isFull],
	)

	return (
		<div className="pool_extended">
			{heading}
			{apyInfo}
			{tvlInfo}
			{isConnected && connectedData}
			{actions}
		</div>
	)
}
