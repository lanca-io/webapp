import type { FC } from 'react'
import { SkeletonLoader } from '../SkeletonLoader'
import { ChartMenu, ChartRange } from '../ChartMenu'
import { useMemo } from 'react'
import { InfoTip } from '../InfoTip'
import './ChartHeading.pcss'

type HeadingProps = {
	title: string
	description: string
	total: number | string
	isLoading: boolean
	range?: ChartRange
	isAdvanced?: boolean
	denomination?: string
	suffix?: number | string
	onChange?: (range: ChartRange) => void
}

export const ChartHeading: FC<HeadingProps> = ({
	title,
	description,
	total,
	isLoading,
	range,
	isAdvanced = true,
	denomination = '$',
	onChange,
	suffix,
}) => {
	const info = useMemo(
		() => (
			<InfoTip
				id={title}
				description={description}
				place="bottom"
				alignment="left"
			/>
		),
		[],
	)

	const menu = useMemo(
		() =>
			isAdvanced && range && onChange ? (
				<ChartMenu range={range} onChange={onChange} />
			) : null,
		[range, onChange, isAdvanced],
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
						<span className="chart_total_symbol">{`${denomination} ${total}`}</span>
						{suffix && (
							<>
								<span className="chart_total_suffix_divider">{'/'}</span>
								<span className="chart_total_suffix">{`${denomination} ${suffix}`}</span>
							</>
						)}
					</>
				)}
			</div>
		</div>
	)
}
