import type { FC } from 'react'
import { ImpactSeverity } from '../../../../hooks/useEstimatePriceImpact'
import './FeesContent.pcss'

type FeesContentProps = {
	severity: ImpactSeverity
}

const TITLES: Record<ImpactSeverity | 'default', string> = {
	[ImpactSeverity.POSITIVE]: 'Positive price Impact',
	[ImpactSeverity.NORMAL]: 'Price impact',
	[ImpactSeverity.WARNING]: 'High price impact',
	[ImpactSeverity.DANGER]: 'Extreme price impact',
	default: 'Price Impact',
}

const MESSAGES: Record<ImpactSeverity | 'default', string> = {
	[ImpactSeverity.POSITIVE]:
		'A positive price impact means you received a better rate than anticipated—enjoy the savings!',
	[ImpactSeverity.NORMAL]:
		'This represents the gap between the expected and actual swap price. It covers slippage, fees, and related costs.',
	[ImpactSeverity.WARNING]:
		'This transaction has a moderate price impact. Consider reviewing the details before proceeding.',
	[ImpactSeverity.DANGER]:
		'It could result in extreme slippage and additional costs. For your protection, this trade will not be executed.',
	default: 'Review the transaction details before proceeding.',
}

export const FeesContent: FC<FeesContentProps> = ({ severity }) => {
	const isPositive = severity === ImpactSeverity.POSITIVE
	const title = TITLES[severity] || TITLES.default
	const message = MESSAGES[severity] || MESSAGES.default

	return (
		<div className={`fees_content ${severity}`}>
			<span className={`fees_content_heading ${isPositive ? 'positive' : ''}`}>{title}</span>
			<div className="fees_content_items">
				<div className="fees_content_item">
					<div className="fees_content_message">{message}</div>
				</div>
			</div>
		</div>
	)
}
