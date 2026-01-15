import type { FC } from 'react'
import { SkeletonLoader } from '../SkeletonLoader'
import { ChartMenu, ChartRange } from '../ChartMenu'
import { useMemo } from 'react'
import { InfoTip } from '../InfoTip'
import './ChartHeading.pcss'

type HeadingProps = {
	title: string
	range?: ChartRange
	tip: { id: string; heading?: string; description: string }
	value: { amount: number; symbol?: string }
	onChange?: (range: ChartRange) => void
	isLoading?: boolean
	showMenu?: boolean
}

export const ChartHeading: FC<HeadingProps> = ({
	title,
	range,
	tip: { id, heading, description },
	value: { symbol = '$' },
	onChange,
	showMenu = true,
	isLoading = false,
}) => {
	const info = useMemo(
		() => (
			<InfoTip
				id={id}
				title={heading}
				description={description}
				place="bottom"
				alignment="left"
			/>
		),
		[],
	)

	const showChartMenu =
		showMenu && range !== undefined && onChange !== undefined
	const menu = useMemo(
		() =>
			showChartMenu ? <ChartMenu range={range!} onChange={onChange!} /> : null,
		[range, onChange, showChartMenu],
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
				{isLoading ? <SkeletonLoader width={140} height={32} /> : menu || null}
			</div>
			<div className="chart_total">
				{isLoading ? (
					<SkeletonLoader width={86} height={36} />
				) : (
					<>
						<span className="chart_total_symbol">{symbol}</span>
						<span className="chart_total_value">{'-'}</span>
					</>
				)}
			</div>
		</div>
	)
}
