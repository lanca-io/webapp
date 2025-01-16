import { formatTime, toLocaleNumber } from '../../../../utils/formatting'
import classNames from './Chart.module.pcss'

export function createTooltip() {
	const toolTip = document.createElement('div')
	toolTip.style.position = 'absolute'
	toolTip.className = classNames.tooltip
	toolTip.style.left = '12px'
	toolTip.style.zIndex = '10'
	toolTip.style.opacity = '1'
	return toolTip
}

const toolTipWidth = 150
const toolTipHeight = 20
const toolTipMargin = 15

export function updateTooltip(param: any, mainSeries: any, toolTip: any, chartElement: any) {
	if (
		param.point === undefined ||
		!param.time ||
		param.point.x < 0 ||
		param.point.x > chartElement.clientWidth ||
		param.point.y < 0 ||
		param.point.y > chartElement.clientHeight
	) {
		toolTip.style.display = 'none'
	} else {
		toolTip.style.display = 'flex'
		const data = param.seriesData.get(mainSeries)
		const price = data.value !== undefined ? data.value : data.close

		let content = ''

		content += `<b>$${toLocaleNumber(price)}</b>`
		content += `<p style='font-weight: 500; color: var(--color-grey-500);'>${formatTime(
			param.time,
			'DD MMM. YYYY',
		)}</p>`

		toolTip.style.opacity = 1
		toolTip.innerHTML = content

		const y = param.point.y
		let left = param.point.x
		if (left > chartElement.clientWidth - toolTipWidth) {
			left = param.point.x - toolTipMargin - toolTipWidth
		}

		let top = y
		if (top > chartElement.clientHeight - toolTipHeight) {
			top = y - toolTipMargin
		}
		toolTip.style.left = left + 'px'
	}
}
