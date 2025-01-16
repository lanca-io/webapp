import classNames from './ConceroPool.module.pcss'
import React, { useMemo } from 'react'
import { useGetLiquidity } from '../../hooks/useGetLiquidity'
import { Link } from 'react-router-dom'
import { IconButton } from '../../../layout/buttons/IconButton/IconButton'
import { ArrowLeftIcon } from '../../../../assets/icons/ArrowLeftIcon'
import { routes } from '../../../../constants/routes'
import { USDCIcon } from '../../../../assets/icons/USDCIcon'
import { PoolSummary } from './PoolSummary/PoolSummary'

const BackArrow: React.FC = () => (
	<Link to={routes.pools} className={classNames.backArrow}>
		<IconButton variant="secondary">
			<ArrowLeftIcon />
		</IconButton>
	</Link>
)

const PoolHeading = (): JSX.Element => {
	return (
		<div className="row ac gap-sm">
			<div className={classNames.iconContainer}>
				<USDCIcon />
			</div>
			<h4 className={classNames.headingTitle}>USDC Pool</h4>
		</div>
	)
}

export const ConceroPool: React.FC = () => {
	const { poolLiquidity, maxCap } = useGetLiquidity()
	const poolCapReached = poolLiquidity > maxCap - 100

	const backArrow = useMemo(() => <BackArrow />, [])
	const heading = useMemo(() => <PoolHeading />, [poolCapReached])

	return (
		<>
			{backArrow}
			{heading}
			<PoolSummary />
		</>
	)
}
