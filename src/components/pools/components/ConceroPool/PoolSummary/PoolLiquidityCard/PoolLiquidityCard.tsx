import classNames from './PoolLiquidityCard.module.pcss'
import { Card } from '../../../../../cards/Card/Card'
import { useGetLiquidity } from '../../../../hooks/useGetLiquidity'
import { ProgressBar } from './ProgressBar/ProgressBar'
import { InfoTooltip } from '../../../../../layout/InfoTooltip/InfoTooltip'

const description =
	'For security reasons, our pools have a maximum capacity limit. However, this can sometimes be exceeded because the pool also stores the fees it has earned.'

export const PoolLiquidityCard = (): JSX.Element => {
	const { poolLiquidity, maxCap, isLoading } = useGetLiquidity()

	return (
		<Card className={classNames.cardContainer}>
			<div className="row gap-sm ac">
				<h4 className={classNames.title}>Pool Liquidity</h4>
				<InfoTooltip description={description} tooltipId={'pool-liquidity'} />
			</div>
			<ProgressBar isLoading={isLoading} currentValue={poolLiquidity} maxValue={maxCap} />
		</Card>
	)
}
