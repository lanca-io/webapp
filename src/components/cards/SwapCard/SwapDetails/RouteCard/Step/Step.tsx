import classNames from './Step.module.pcss'
import { useTranslation } from 'react-i18next'
import { Badge } from '../../../../../layout/Badge/Badge'
import { config } from '../../../../../../constants/config'
import type { ConceroToken, ConceroChain, SwapDirectionData, Fee } from 'lanca-sdk-demo'

interface InnerStepCardProps {
	step: {
		from: SwapDirectionData
		to: SwapDirectionData
		tool: {
			name: string
			logoURL: string
			fees: Fee[]
			type: 'bridge' | 'swap'
			additionalInfo: {
				fee: number
				deadline: number
				containDstUnwrapWNative?: boolean
			}
		}
	}
}

interface DirectionProps {
	direction: {
		token: ConceroToken
		chainData?: ConceroChain
		amount: string
	}
	title: string
}

const Direction = ({ direction, title }: DirectionProps) => {
	const { token, chainData, amount } = direction

	const chainImg = `${config.CONCERO_ASSETS_URI}/icons/chains/filled/${direction.chainData?.id}.svg`

	return (
		<div className={classNames.tagContainer}>
			<p className={'body2'}>{title}:</p>
			<div className={classNames.amountContainer}>
				{token.logoURL && <Badge size="m" tokenLogoSrc={token.logoURL} />}

				<div className="row gap-xs ac">
					<h4 className={classNames.price}>{Number(amount).toFixed(3)}</h4>
					<p className={`${classNames.symbol} body4`}>{token.symbol}</p>
				</div>

				<p className="body2">on</p>
				{chainData?.logoURL && <Badge size="m" borderSmall tokenLogoSrc={chainImg} />}

				<h4 className={classNames.chain}>{chainData?.name}</h4>
			</div>
		</div>
	)
}

export function StepCard({ step }: InnerStepCardProps) {
	const { t } = useTranslation()
	const { from, to, tool } = step

	const stepTypeTitles: Record<string, string> = {
		swap: t('swapCard.routeCard.swap'),
		bridge: t('swapCard.routeCard.bridge'),
	}

	const stepToolTitles: Record<string, string> = {
		bridge: 'Concero',
	}

	const stepTypeTitle = stepTypeTitles[tool.type] ?? t('swapCard.routeCard.swap')
	const stepToolTitle = stepToolTitles[tool.type]

	return (
		<div className={classNames.container}>
			<div className="row jsb">
				<p className={`${classNames.type} body2`}>{stepTypeTitle}</p>
				{tool.type === 'bridge' && (
					<p className={'body2'}>
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
}
