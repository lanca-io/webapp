import { memo } from 'react'
import { PoolCardStage, StageType } from '../../poolReducer/types'
import { TrailArrowRightIcon } from '../../../../../../assets/icons/TrailArrowRightIcon'
import { Badge } from '../../../../../layout/Badge/Badge'
import classNames from './ProgressDetails.module.pcss'

interface Props {
	stage: PoolCardStage
	steps: any
	from: any
	to: any
}

const stageImageMap: Partial<Record<PoolCardStage, string>> = {
	[PoolCardStage.progress]: '/Process.png',
	[PoolCardStage.success]: '/Success.png',
	[PoolCardStage.failed]: '/Error.png',
}

export const ProgressDetails = memo(({ stage, steps, from, to }: Props) => {
	const imageSrc = stageImageMap[stage] || '/Process.png'
	const currentStep = steps[steps.length - 1]

	const showTokenTransfer =
		currentStep && (currentStep.type === StageType.transaction || currentStep.type === StageType.requestTx)

	return (
		<div className="row ac gap-sm">
			{!showTokenTransfer && <img src={imageSrc} alt={stage} className="icon" />}
			{showTokenTransfer && (
				<div className="row ac gap-sm">
					<div className={classNames.tokenBox}>
						<Badge size="xl" tokenLogoSrc={from.token.logoURI} chainLogoSrc={from.chain.logoURI} />
					</div>
					<TrailArrowRightIcon />
					<div className={classNames.tokenBox}>
						<Badge size="xl" tokenLogoSrc={to.token.logoURI} chainLogoSrc={to.chain.logoURI} />
					</div>
				</div>
			)}
		</div>
	)
})
