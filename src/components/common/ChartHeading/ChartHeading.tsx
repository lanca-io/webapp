import type { FC } from 'react'
import { SkeletonLoader } from '../SkeletonLoader'
import { ChartMenu, ChartRange } from '../ChartMenu'
import { useMemo } from 'react'
import { InfoTip } from '../InfoTip'
import { useCompactNumber } from '@/hooks'
import './ChartHeading.pcss'

type HeadingProps = {
	title: string
	range: ChartRange
	tip: { id: string; heading: string; description: string }
	value: { amount: number; symbol?: string }
	onChange: (range: ChartRange) => void
	isLoading?: boolean
}

export const ChartHeading: FC<HeadingProps> = ({
	title,
	range,
	tip: { id, heading, description },
	value: { amount, symbol = '$' },
	onChange,
	isLoading = false,
}) => {
	const { format } = useCompactNumber()

	const info = useMemo(
		() => <InfoTip id={id} title={heading} description={description} />,
		[],
	)

	const menu = useMemo(
		() => <ChartMenu range={range} onChange={onChange} />,
		[range, onChange],
	)

	return (
		<div className="chart_heading">
			<div className="chart_toolbar">
				<div className="chart_description">
					{isLoading ? (
						<SkeletonLoader width={135} height={32} />
					) : (
						<>
							<span className="chart_label">{title}</span>
							{info}
						</>
					)}
				</div>
				{isLoading ? <SkeletonLoader width={140} height={32} /> : menu}
			</div>
			<div className="chart_total">
				{isLoading ? (
					<SkeletonLoader width={86} height={36} />
				) : (
					<>
						<span className="chart_total_symbol">{symbol}</span>
						<span className="chart_total_value">{format(amount)}</span>
					</>
				)}
			</div>
		</div>
	)
}
