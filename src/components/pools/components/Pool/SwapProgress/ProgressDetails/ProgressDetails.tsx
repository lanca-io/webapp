import { memo, useMemo } from 'react'
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

export const ProgressDetails = memo(({ stage, steps, from, to }: Props) => {
	const currentStep = steps[steps.length - 1]

	const showTokenTransfer = useMemo(() => {
		return currentStep && (currentStep.type === StageType.transaction || currentStep.type === StageType.requestTx)
	}, [currentStep])

	const imageSrc = useMemo(() => {
		if (stage === PoolCardStage.failed) return '/Error.png'
		if (stage === PoolCardStage.success) return '/Success.png'
		if (!showTokenTransfer) return '/Process.png'
		return null
	}, [stage, showTokenTransfer])

	return (
		<div className="row ac gap-sm">
			{imageSrc ? (
				<img src={imageSrc} alt={stage} className="icon" width={160} height={160} />
			) : (
				<>
					<div className={classNames.tokenBox}>
						<Badge size="xl" tokenLogoSrc={from.token.logoURI} chainLogoSrc={from.chain.logoURI} />
					</div>
					<TrailArrowRightIcon />
					<div className={classNames.tokenBox}>
						<Badge size="xl" tokenLogoSrc={to.token.logoURI} chainLogoSrc={to.chain.logoURI} />
					</div>
				</>
			)}
		</div>
	)
})
