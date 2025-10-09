'use client'

import { useMemo } from 'react'

import { useDevice } from '@front/entities/bluetooth-device/context'
import { useDataLogger } from '@front/entities/bluetooth-device/use-data-logger'
import { isValidTemperature } from '@front/entities/bluetooth-device/validation'
import { Activity } from 'lucide-react'
import 'uplot/dist/uPlot.min.css'

import { PressureChart } from '../ad-chart'
import { TemperatureChart } from '../temp-chart'

export function DataChart() {
	const { receivedData } = useDevice()

	const { chartData: data } = useDataLogger(receivedData)

	const sensorBounds = useMemo(() => {
		if (!receivedData?.SensorBound) return undefined

		return {
			T0: isValidTemperature(receivedData.SensorBound[0]) ? receivedData.SensorBound[0] : undefined,
			T1: isValidTemperature(receivedData.SensorBound[1]) ? receivedData.SensorBound[1] : undefined,
			T2: isValidTemperature(receivedData.SensorBound[2]) ? receivedData.SensorBound[2] : undefined,
			T3: isValidTemperature(receivedData.SensorBound[3]) ? receivedData.SensorBound[3] : undefined
		}
	}, [receivedData?.SensorBound])

	return (
		<section className="space-y-6 border p-2 rounded-lg h-[calc(100vh-12rem)] sm:h-dvh">
			<div className="w-full h-2/3 pb-20">
				<div className="flex p-3 pb-0 items-center gap-2 font-medium">
					<Activity className="w-5 h-5" />
					Графики температур и давления
				</div>
				<TemperatureChart data={data} sensorBounds={sensorBounds} />
			</div>
			<div className="w-full h-1/3 pb-20">
				<PressureChart data={data} />
			</div>
		</section>
	)
}
