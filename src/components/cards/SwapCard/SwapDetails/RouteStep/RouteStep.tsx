import { useMemo, memo } from 'react'
import classNames from './RouteStep.module.pcss'
import { useTranslation } from 'react-i18next'
import { Badge } from '../../../../layout/Badge/Badge'
import { config } from '../../../../../constants/config'
import {
	type ISwapDirectionData,
	StepType,
	type IRouteStep as RouteStepType,
	type IRouteStep,
	type IRouteBaseStep,
	type IRouteTool,
} from '@lanca/sdk'
import { TokenAmounts } from '../../../../../utils/TokenAmounts'
import { toTitleCase } from '../../../../../utils/formatting'

interface DirectionProps {
	direction: ISwapDirectionData
	title: string
}

const Direction = memo(({ direction, title }: DirectionProps) => {
	const { token, chain, amount } = direction

	const chainImg = `${config.CONCERO_ASSETS_URI}/icons/chains/filled/${chain.id}.svg`

	const formattedAmount = useMemo(() => {
		const tokenAmounts = new TokenAmounts(amount, token.decimals)
		return tokenAmounts.format(3)
	}, [amount, token.decimals])

	return (
		<div className={classNames.tagContainer}>
			<p className={'body2'}>{title}:</p>
			<div className={classNames.amountContainer}>
				{token.logoURL && <Badge size="m" tokenLogoSrc={token.logoURL} />}

				<div className="row gap-xs ac">
					<p className={classNames.price}>{formattedAmount}</p>
					<p className={`${classNames.symbol} body4`}>{token.symbol}</p>
				</div>

				<p className="body2">on</p>
				{chain?.logoURL && <Badge size="m" borderSmall tokenLogoSrc={chainImg} />}

				<h4 className={classNames.chain}>{chain?.name}</h4>
			</div>
		</div>
	)
})

interface InnerStepCardProps {
	step: RouteStepType | IRouteBaseStep
}

function hasInternalSteps(step: IRouteStep | IRouteBaseStep): step is IRouteStep {
	return 'internalSteps' in step
}

function hasTool(step: IRouteStep | IRouteBaseStep): step is IRouteStep & { tool: IRouteTool } {
	return 'tool' in step
}

export function RouteStep({ step }: InnerStepCardProps) {
	const { t } = useTranslation()

	const stepTypeTitles = useMemo(
		() => ({
			[StepType.SRC_SWAP]: t('swapCard.routeCard.swap'),
			[StepType.BRIDGE]: t('swapCard.routeCard.bridge'),
			[StepType.DST_SWAP]: t('swapCard.routeCard.swap'),
			[StepType.ALLOWANCE]: t('swapCard.routeCard.allowance'),
			[StepType.SWITCH_CHAIN]: t('swapCard.routeCard.switchChain'),
		}),
		[t],
	)

	const stepToolTitles = useMemo(() => {
		const toolName =
			hasInternalSteps(step) && step.internalSteps.length > 0
				? step.internalSteps[0].tool.name
				: hasTool(step)
					? step.tool.name
					: ''
		return {
			[StepType.SRC_SWAP]: toTitleCase(toolName),
			[StepType.BRIDGE]: toTitleCase(toolName),
			[StepType.DST_SWAP]: toTitleCase(toolName),
			[StepType.ALLOWANCE]: '',
			[StepType.SWITCH_CHAIN]: '',
		}
	}, [step])

	if ('from' in step && 'to' in step) {
		const { from, to, type } = step
		const stepTypeTitle = stepTypeTitles[type] ?? t('swapCard.routeCard.swap')
		const stepToolTitle = stepToolTitles[type] ?? ''

		return (
			<div className={classNames.container}>
				<div className="row gap-sm ac">
					<p className={`${classNames.type} body2`}>{stepTypeTitle}</p>
					{(type === StepType.BRIDGE || type === StepType.SRC_SWAP || type === StepType.DST_SWAP) &&
						stepToolTitle && (
							<p className={'body4'}>
								{t('swapCard.routeCard.via')} {stepToolTitle}
							</p>
						)}
				</div>

				<div className="gap-xs">
					<Direction direction={from} title="From" />
					<Direction direction={to} title="To" />
				</div>
			</div>
		)
	} else {
		const { type } = step
		const stepTypeTitle = stepTypeTitles[type] ?? t('swapCard.routeCard.swap')

		return (
			<div className={classNames.container}>
				<div className="row jsb">
					<p className={`${classNames.type} body2`}>{stepTypeTitle}</p>
				</div>
			</div>
		)
	}
}
