import classNames from './Step.module.pcss'
import { useTranslation } from 'react-i18next'
import { Badge } from '../../../../../layout/Badge/Badge'
import { type Step, type StepDirectionData } from '../../../../../../sdk/types/routeTypes'

interface InnerStepCardProps {
	step: Step
}

interface DirectionProps {
	direction: StepDirectionData
	title: string
}

const Direction = ({ direction, title }: DirectionProps) => {
	const { token, chainData } = direction

	return (
		<div className={classNames.tagContainer}>
			<p className={'body2'}>{title}:</p>
			<div className={classNames.amountContainer}>
				{token.logoURI && <Badge size="m" tokenLogoSrc={token.logoURI} />}

				<div className="row gap-xs ac">
					<h4 className={classNames.price}>
						{(Number(token.priceUsd) * Number(direction.amount)).toFixed(3)}
					</h4>
					<p className={`${classNames.symbol} body4`}>{token.symbol}</p>
				</div>

				<p className="body2">on</p>
				{chainData?.logoURI && <Badge size="m" borderSmall tokenLogoSrc={chainData.logoURI} />}

				<h4>{chainData?.name}</h4>
			</div>
		</div>
	)
}

export function StepCard({ step }: InnerStepCardProps) {
	console.log(step)
	const { t } = useTranslation()
	const { from, to, tool } = step

	const stepTypeTitles: Record<string, string> = {
		swap: t('swapCard.routeCard.swap'),
		bridge: t('swapCard.routeCard.bridge'),
	}

	const stepToolTitles: Record<string, string> = {
		swap: tool.name,
		bridge: 'Concero',
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
				<Direction direction={from} title="From" />
				<Direction direction={to} title="To" />
			</div>
		</div>
	)
}
