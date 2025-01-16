import { ColorType, type DeepPartial, type AreaStyleOptions, type SeriesOptionsCommon } from 'lightweight-charts'
import { colors } from '../../../../constants/colors'

export const chartOptions = {
	layout: {
		background: {
			type: ColorType.Solid,
			color: 'transparent',
		},
		textColor: colors.text.secondary,
		fontFamily: 'DM_Sans',
	},
	localization: {
		locale: 'en-US',
		dateFormat: 'dd MMM',
	},
	grid: {
		vertLines: {
			style: 1,
			visible: false,
		},
		horzLines: {
			style: 1,
			visible: false,
		},
	},
	timeScale: {
		timeVisible: true,
		secondsVisible: true,
	},
	crosshair: {
		horzLine: {
			visible: false,
			labelVisible: false,
		},
		vertLine: {
			visible: false,
			labelVisible: false,
		},
	},
	autoSize: true,
	handleScroll: false,
	handleScale: false,
}

const lineColor = '#ace1fb'

const getTopColor = () => {
	return '#ACE1FB'
}
const getBottomColor = () => {
	return 'rgba(215, 240, 253, 0)'
}

export const areaSeriesOptions: DeepPartial<AreaStyleOptions & SeriesOptionsCommon> = {
	baseLineVisible: false,
	lineType: 0,
	lineWidth: 2,
	topColor: getTopColor(),
	bottomColor: getBottomColor(),
	baseLineStyle: 1,
	lineColor,
	priceFormat: {
		type: 'volume',
	},
	priceLineVisible: false,
}
