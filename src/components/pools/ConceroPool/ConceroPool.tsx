import classNames from './ConceroPool.module.pcss'
import React, { useMemo } from 'react'
import { useGetLiquidity } from '../hooks/useGetLiquidity'
import { Link } from 'react-router-dom'
import { IconButton } from '../../layout/buttons/IconButton/IconButton'
import { ArrowLeftIcon } from '../../../assets/icons/ArrowLeftIcon'
import { routes } from '../../../constants/routes'
import { USDCIcon } from '../../../assets/icons/USDCIcon'

interface PoolHeadingProps {
	poolCapReached: boolean
}

const BackArrow: React.FC = () => (
	<Link to={routes.home} className={classNames.backArrow}>
		<IconButton variant="secondary">
			<ArrowLeftIcon />
		</IconButton>
	</Link>
)

const PoolHeading = ({ poolCapReached }: PoolHeadingProps): JSX.Element => {
	return (
		<div className="row ac gap-sm">
			<div className={classNames.iconContainer}>
				<USDCIcon />
			</div>
			<h4 className={classNames.title}>USDC Pool</h4>
			{/* {poolCapReached && <Tag size="sm">Full</Tag>} */}
		</div>
	)
}

export const ConceroPool: React.FC = () => {
	const { poolLiquidity, maxCap } = useGetLiquidity()
	const poolCapReached = poolLiquidity > maxCap - 100

	const backArrow = useMemo(() => <BackArrow />, [])
	const heading = useMemo(() => <PoolHeading poolCapReached={poolCapReached} />, [poolCapReached])

	return (
		<>
			{backArrow}
			{heading}
		</>
	)
}
