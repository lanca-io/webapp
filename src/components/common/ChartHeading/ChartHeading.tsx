import type { FC } from 'react'
import { SkeletonLoader } from '../SkeletonLoader'
import { ChartMenu, ChartRange } from '../ChartMenu'
import { useMemo } from 'react'
import { InfoTip } from '../InfoTip'
import { abbreviateNumber } from '@/utils/format'
import './ChartHeading.pcss'

type HeadingProps = {
	title: string
	description: string
	total: number | string
	value?: number | string
	isLoading: boolean
	range?: ChartRange
	isAdvanced?: boolean
	leftDenomination?: string
	rightDenomination?: string
	onChange?: (range: ChartRange) => void
}

export const ChartHeading: FC<HeadingProps> = ({
	title,
	description,
	total,
	isLoading,
	range,
	isAdvanced = true,
	leftDenomination = '',
	rightDenomination = '$',
	value,
	onChange,
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
		[title, description],
	)

	const menu = useMemo(
		() =>
			isAdvanced && range && onChange ? (
				<ChartMenu range={range} onChange={onChange} />
			) : null,
		[range, onChange, isAdvanced],
	)

	const renderTotal = (
		amount: number | string,
		leftDenom: string,
		rightDenom: string,
	) => {
		if (!Number.isFinite(Number(amount))) return '0'
		const num = abbreviateNumber(Number(amount))
		return leftDenom && rightDenom
			? `${leftDenom} ${num} ${rightDenom}`
			: leftDenom
				? `${leftDenom} ${num}`
				: rightDenom
					? `${num} ${rightDenom}`
					: num
	}

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
						<span className="chart_total_symbol">
							{renderTotal(total, leftDenomination, rightDenomination)}
						</span>
						{value && (
							<>
								<span className="chart_total_suffix_divider">{'/'}</span>
								<span className="chart_total_suffix">
									{renderTotal(value, leftDenomination, rightDenomination)}
								</span>
							</>
						)}
					</>
				)}
			</div>
		</div>
	)
}
