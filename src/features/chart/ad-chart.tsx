import { memo, useEffect, useMemo, useRef } from 'react'

import { isValidPressure } from '@front/entities/bluetooth-device/validation'
import { ChartDataPoint } from '@front/kernel/domain/types'
import uPlot from 'uplot'

export const PressureChart = memo(function PressureChart({ data }: { data: ChartDataPoint[] }) {
	const chartRef = useRef<HTMLDivElement>(null)
	const plotRef = useRef<uPlot | null>(null)

	const stats = useMemo(() => {
		const values = data.map(d => d.AD).filter(v => v !== null && isValidPressure(v)) as number[]

		if (values.length === 0) return null

		return {
			min: Math.min(...values),
			max: Math.max(...values),
			current: values[values.length - 1],
			avg: values.reduce((a, b) => a + b, 0) / values.length
		}
	}, [data])

	useEffect(() => {
		if (!chartRef.current || data.length === 0 || !stats) return

		const timestamps = data.map(d => d.timestamp / 1000)
		const pressureValues = data.map(d => (d.AD === null ? undefined : d.AD) as number | undefined)

		const opts: uPlot.Options = {
			width: chartRef.current.clientWidth,
			height: chartRef.current.clientHeight,
			series: [
				{ label: 'Время' },
				{
					label: 'Давление',
					stroke: '#a78bfa',
					width: 2,
					points: { show: false }
				}
			],
			axes: [
				{
					stroke: '#94a3b8',
					grid: { stroke: 'var(--muted-foreground)', width: 1 }
				},
				{
					stroke: '#94a3b8',

					grid: { stroke: 'var(--muted-foreground)', width: 1 },
					label: 'мм рт.ст.',
					labelSize: 20,
					labelFont: 'bold 12px sans-serif'
				}
			],
			scales: {
				x: {
					time: true
				}
			},
			legend: {
				show: true
			},
			cursor: {
				drag: {
					x: false,
					y: false
				}
			}
		}

		if (plotRef.current) {
			plotRef.current.destroy()
		}

		plotRef.current = new uPlot(opts, [timestamps, pressureValues], chartRef.current)

		const handleResize = () => {
			if (plotRef.current && chartRef.current) {
				plotRef.current.setSize({
					width: chartRef.current.clientWidth,
					height: chartRef.current.clientHeight
				})
			}
		}

		window.addEventListener('resize', handleResize)

		return () => {
			window.removeEventListener('resize', handleResize)
			if (plotRef.current) {
				plotRef.current.destroy()
			}
		}
	}, [data, stats])

	if (!stats) return null

	return <div ref={chartRef} className="w-full h-full" />
})
