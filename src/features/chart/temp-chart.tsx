import { memo, useEffect, useMemo, useRef } from 'react'

import {
	SENSOR_CONFIG,
	SensorKey,
	isValidTemperature
} from '@front/entities/bluetooth-device/validation'
import { ChartDataPoint } from '@front/kernel/domain/types'
import uPlot from 'uplot'

export const TemperatureChart = memo(function TemperatureChart({
	data,
	sensorBounds
}: {
	data: ChartDataPoint[]
	sensorBounds?: { T0?: number; T1?: number; T2?: number; T3?: number }
}) {
	const chartRef = useRef<HTMLDivElement>(null)
	const plotRef = useRef<uPlot | null>(null)

	const stats = useMemo(() => {
		const activeSensors: SensorKey[] = []
		const sensorStats: Record<string, { min: number; max: number; current: number; avg: number }> = {}

		Object.keys(SENSOR_CONFIG).forEach(key => {
			const sensorKey = key as SensorKey
			const values = data.map(d => d[sensorKey]).filter(v => v !== null) as number[]

			if (values.length > 0) {
				activeSensors.push(sensorKey)
				const min = Math.min(...values)
				const max = Math.max(...values)
				const current = values[values.length - 1]
				const avg = values.reduce((a, b) => a + b, 0) / values.length

				sensorStats[sensorKey] = { min, max, current, avg }
			}
		})

		return { activeSensors, sensorStats }
	}, [data])

	useEffect(() => {
		if (!chartRef.current || data.length === 0) return

		const timestamps = data.map(d => d.timestamp / 1000)
		const series: uPlot.Series[] = [{ label: 'Время' }]
		const seriesData: uPlot.AlignedData = [timestamps]

		stats.activeSensors.forEach(sensorKey => {
			const config = SENSOR_CONFIG[sensorKey]
			const values = data.map(
				d => (d[sensorKey] === null ? undefined : d[sensorKey]) as number | undefined
			)

			seriesData.push(values)
			series.push({
				label: config.label,
				stroke: config.color,
				width: 2,
				points: { show: false }
			})

			const bound = sensorBounds?.[sensorKey]
			if (bound && isValidTemperature(bound)) {
				const thresholdValues = data.map(() => bound)
				seriesData.push(thresholdValues)
				series.push({
					label: `${config.label} (порог)`,
					stroke: config.color,
					width: 1,
					dash: [5, 5],
					points: { show: false }
				})
			}
		})

		const opts: uPlot.Options = {
			width: chartRef.current.clientWidth,
			height: chartRef.current.clientHeight,
			series,
			axes: [
				{
					stroke: '#94a3b8',
					grid: { stroke: 'var(--muted-foreground)', width: 1 }
				},
				{
					stroke: '#94a3b8',
					grid: { stroke: 'var(--muted-foreground)', width: 1 },
					label: '°C',
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

		plotRef.current = new uPlot(opts, seriesData, chartRef.current)

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
	}, [data, stats.activeSensors, sensorBounds])

	return <div ref={chartRef} className="w-full h-full" />
})
