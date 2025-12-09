import type { ReactNode } from 'react'
import { Tooltip as TooltipWrapper } from 'react-tooltip'
import './Tooltip.pcss'

type TooltipProps = {
	children: ReactNode
	tooltipId: string
	tooltipContent: JSX.Element
	className?: string
	disabled?: boolean
	place?:
		| 'top'
		| 'top-start'
		| 'top-end'
		| 'right'
		| 'right-start'
		| 'right-end'
		| 'bottom'
		| 'bottom-start'
		| 'bottom-end'
		| 'left'
		| 'left-start'
		| 'left-end'
}

export const Tooltip = ({
	children,
	tooltipId,
	tooltipContent,
	className,
	disabled,
	place,
}: TooltipProps): JSX.Element => {
	if (disabled) return <>{children}</>
	return (
		<div>
			<div data-tooltip-id={tooltipId}>{children}</div>
			<TooltipWrapper place={place} id={tooltipId} opacity={1} className={`tooltip ${className}`}>
				{tooltipContent}
			</TooltipWrapper>
		</div>
	)
}
