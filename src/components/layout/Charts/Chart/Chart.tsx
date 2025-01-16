import { type FC, useEffect, useRef, useCallback, useMemo } from 'react'
import { createChart, type IChartApi, type ISeriesApi } from 'lightweight-charts'
import { animated, useSpring } from '@react-spring/web'
import { areaSeriesOptions, chartOptions } from './chartOptions'
import { createTooltip, updateTooltip } from './Tooltip'
import dayjs from 'dayjs'

export interface ChartData {
	value: number
	time: number
}

interface ChartProps {
	data: ChartData[]
}

const useFadeInAnimation = () =>
	useSpring({
		from: { opacity: 0 },
		to: { opacity: 1 },
		config: { duration: 300 },
		reset: true,
	})

const formatChartData = (data: ChartData[]) =>
	data.map(item => ({
		value: Number(item.value.toFixed(2)),
		time: dayjs(item.time).format('YYYY-MM-DD'),
	}))

const setupChartStyles = (chart: IChartApi) => {
	chart.timeScale().applyOptions({ visible: true, borderColor: 'transparent' })
	chart.priceScale('right').applyOptions({ visible: false })
	chart.applyOptions({
		layout: {
			attributionLogo: false,
		},
	})
}

const cleanupChart = (
	chart: IChartApi,
	handleResize: () => void,
	tooltipRef: React.MutableRefObject<HTMLDivElement | null>,
) => {
	window.removeEventListener('resize', handleResize)
	chart.remove()
	if (tooltipRef.current) {
		tooltipRef.current.remove()
		tooltipRef.current = null
	}
}

export const Chart: FC<ChartProps> = ({ data }) => {
	const chartRef = useRef<HTMLDivElement>(null)
	const tooltipRef = useRef<HTMLDivElement | null>(null)
	const seriesRef = useRef<ISeriesApi<'Area'> | null>(null)
	const chartInstanceRef = useRef<IChartApi | null>(null)

	const fadeProps = useFadeInAnimation()

	const clearData = useMemo(() => formatChartData(data), [data])

	const handleResize = useCallback(() => {
		if (chartRef.current && chartInstanceRef.current) {
			const { clientWidth, clientHeight } = chartRef.current
			chartInstanceRef.current.resize(clientWidth, clientHeight)
			chartInstanceRef.current.timeScale().fitContent()
		}
	}, [])

	useEffect(() => {
		if (!chartRef.current) return

		const chart = createChart(chartRef.current, chartOptions)
		chartInstanceRef.current = chart

		setupChartStyles(chart)

		seriesRef.current = chart.addAreaSeries(areaSeriesOptions)
		seriesRef.current.setData(clearData)
		tooltipRef.current = createTooltip()
		chartRef.current.appendChild(tooltipRef.current)
		chart.timeScale().fitContent()

		window.addEventListener('resize', handleResize)
		chart.subscribeCrosshairMove(param => {
			if (tooltipRef.current) updateTooltip(param, seriesRef.current!, tooltipRef.current, chartRef.current!)
		})

		return () => {
			cleanupChart(chart, handleResize, tooltipRef)
		}
	}, [clearData, handleResize])

	return <animated.div className="f1" ref={chartRef} style={fadeProps} />
}
