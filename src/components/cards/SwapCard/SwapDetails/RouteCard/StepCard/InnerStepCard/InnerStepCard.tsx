import classNames from './InnerStepCard.module.pcss'
import { type Step, StepTypes } from '../../../../../../../types/StandardRoute'
import { useTranslation } from 'react-i18next'
import { roundNumberByDecimals } from '../../../../../../../utils/formatting'
import { Badge } from '../../../../../../badges/Badge/Badge'

interface InnerStepCardProps {
	step: Step
}

export function InnerStepCard({ step }: InnerStepCardProps) {
	const { t } = useTranslation()
	const { from, to, tool } = step

	const stepTypeTitles: Record<string, string> = {
		[StepTypes.swap]: t('swapCard.routeCard.swap'),
		[StepTypes.bridge]: t('swapCard.routeCard.bridge'),
	}

	const stepToolTitles: Record<string, string> = {
		[StepTypes.swap]: tool.name,
		[StepTypes.bridge]: 'Concero',
	}

	const stepTypeTitle = stepTypeTitles[step.tool.type] ?? t('swapCard.routeCard.swap')
	const stepToolTitle = stepToolTitles[step.tool.type]

	return (
		<div className={classNames.container}>
			<div className="row jsb">
				<p className={`${classNames.type} body2`}>{stepTypeTitle}</p>
				<p className={'body2'}>
					{t('swapCard.routeCard.via')} {stepToolTitle}
				</p>
			</div>

			<div className="gap-xs">
				<div className={classNames.tagContainer}>
					<p className={'body2'}>From:</p>
					<div className={classNames.amountContainer}>
						{from.token.logo_uri && <Badge size="m" tokenLogoSrc={from.token.logo_uri} />}

						<div className="row gap-xs ac">
							<h4>{roundNumberByDecimals(from.token.amount)}</h4>
							<p className="body4">{from.token.symbol}</p>
						</div>

						<p className="body2">on</p>
						{from.token.logo_uri && <Badge size="m" borderSmall tokenLogoSrc={from.token.logo_uri} />}

						<h4>Arbitrum</h4>
					</div>
				</div>

				<div className={classNames.tagContainer}>
					<p className={'body2'}>To:</p>
					<div className={classNames.amountContainer}>
						{to.token.logo_uri && <Badge size="m" tokenLogoSrc={to.token.logo_uri} />}

						<div className="row gap-xs ac">
							<h4>{roundNumberByDecimals(to.token.amount)}</h4>
							<p className="body4">{to.token.symbol}</p>
						</div>

						<p className="body2">on</p>
						{to.token.logo_uri && <Badge size="m" borderSmall tokenLogoSrc={to.token.logo_uri} />}

						<h4>Arbitrum</h4>
					</div>
				</div>
			</div>
		</div>
	)
}
