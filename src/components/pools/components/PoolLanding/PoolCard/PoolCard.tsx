import React from 'react'
import { Card } from '../../../../cards/Card/Card'
import { Tag } from '../../../../layout/Tag/Tag'
import { useGetLiquidity } from '../../../hooks/useGetLiquidity'
import { SkeletonLoader } from '../../../../layout/SkeletonLoader/SkeletonLoader'
import { toLocaleNumber } from '../../../../../utils/formatting'
import { Link } from 'react-router-dom'
import { Button } from '../../../../layout/buttons/Button/Button'
import { type Fee } from '../../../hooks/useGetFees'
import { usePoolMetrics } from '../../../hooks/useGetPoolMetrics'
import { routes } from '../../../../../constants/routes'
import classNames from './PoolCard.module.pcss'

interface PoolCardProps {
	fees: Fee[]
	title: string
	isDisabled: boolean
	icon: React.ReactNode
}

const PoolStatus = ({ isDisabled }: { isDisabled: boolean }) => (
	<div className={classNames.poolStatus}>
		{!isDisabled ? (
			<Tag className={classNames.poolStatus} variant="positive">
				LP cup increased
			</Tag>
		) : (
			<Tag className={classNames.poolStatus} variant="neutral">
				Coming soon
			</Tag>
		)}
	</div>
)

const GeneralInfo = ({
	title,
	icon,
	isDisabled,
	isLoading,
	apy,
}: {
	title: string
	icon: React.ReactNode
	isDisabled: boolean
	isLoading: boolean
	apy: string
}) => (
	<div className={classNames.info}>
		{icon}
		<div className={classNames.generalInfo}>
			<h4 className={classNames.title}>{title}</h4>
			{!isDisabled &&
				(isLoading ? (
					<SkeletonLoader height={32} width={80} />
				) : (
					<Tag className={classNames.poolStatus}>APY {apy}%</Tag>
				))}
		</div>
	</div>
)

const PoolStats = ({
	poolLiquidity,
	maxCap,
	totalRewards,
	isDisabled,
	isLoading,
}: {
	poolLiquidity: number
	maxCap: number
	totalRewards: string
	isDisabled: boolean
	isLoading: boolean
}) => (
	<div className={classNames.poolStats}>
		<div className={classNames.statsRow}>
			<p>Total Liquidity</p>
			<div className="row gap-xs">
				{isDisabled ? (
					<b className={classNames.stat}>-</b>
				) : isLoading ? (
					<SkeletonLoader height={21} width={67} />
				) : (
					<b className={classNames.stat}>${toLocaleNumber(poolLiquidity)}</b>
				)}
				<p>/</p>
				{isDisabled ? (
					<b className={classNames.stat}>-</b>
				) : isLoading ? (
					<SkeletonLoader height={21} width={67} />
				) : (
					<b className={classNames.stat}>${toLocaleNumber(maxCap)}</b>
				)}
			</div>
		</div>
		<div className={classNames.statsRow}>
			<p>Rewards Distributed</p>
			<div>
				{isDisabled ? (
					<b className={classNames.stat}>-</b>
				) : isLoading ? (
					<SkeletonLoader height={20} width={64} />
				) : (
					<b className={classNames.stat}>${totalRewards}</b>
				)}
			</div>
		</div>
	</div>
)

export const PoolCard = ({ title, fees, icon, isDisabled }: PoolCardProps): JSX.Element => {
	const { poolLiquidity, maxCap, isLoading: isLiquidityLoading } = useGetLiquidity()
	const { apy, totalRewards, isLoading: isMetricsLoading } = usePoolMetrics(fees, poolLiquidity, isLiquidityLoading)

	const isLoading = isLiquidityLoading || isMetricsLoading

	return (
		<Card className={`w-full ${classNames.container}`}>
			<div className={classNames.content}>
				<PoolStatus isDisabled={isDisabled} />
				<GeneralInfo title={title} icon={icon} isDisabled={isDisabled} isLoading={isLoading} apy={apy} />
				<PoolStats
					poolLiquidity={poolLiquidity}
					maxCap={maxCap}
					totalRewards={totalRewards}
					isDisabled={isDisabled}
					isLoading={isLoading}
				/>
				<div className={classNames.buttons}>
					<Link to={routes.home} className={classNames.button}>
						<Button isFull size="md" isDisabled={isDisabled}>
							Deposit
						</Button>
					</Link>
					<Link to={routes.usdcPools} className={classNames.button}>
						<Button isFull size="md" variant="secondaryColor" isDisabled={isDisabled}>
							Open Earnings
						</Button>
					</Link>
				</div>
			</div>
		</Card>
	)
}

// NEED to update route paths here
