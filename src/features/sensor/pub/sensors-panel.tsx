'use client'

import { useState } from 'react'

import { useDevice } from '@front/entities/bluetooth-device/context'
import { SENSOR_CONFIG } from '@front/entities/bluetooth-device/validation'
import { SensorConfigDialog } from '@front/features/sensor/sensor-dialog'
import { SensorPanel } from '@front/features/sensor/sensor-panel'

const SensorsPanel = () => {
	const { isConnected, receivedData, commandClient } = useDevice()
	const [sensorDialogOpen, setSensorDialogOpen] = useState(false)
	const [selectedSensor, setSelectedSensor] = useState<number>(0)

	const handleSensorClick = (index: number) => {
		if (!isConnected) return
		setSelectedSensor(index)
		setSensorDialogOpen(true)
	}

	const handleSensorSave = (sensorIndex: number, bound: number, reaction: number) => {
		commandClient.setSensorBound(sensorIndex, bound, reaction)
	}

	const sensorValues = receivedData?.SensorValue || []
	const sensorBounds = receivedData?.SensorBound || []
	const drivesStatus = receivedData?.DrivesStatus || 0
	const adValue = receivedData?.ADValue

	return (
		<div className="flex sm:w-full  sm:overflow-x-scroll md:left-0 flex-col gap-4 md:fixed z-10 md:bottom-0 md:flex-row justify-between col-span-2 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:gap-2">
			<SensorPanel
				label={Object.values(SENSOR_CONFIG)[0]?.label || 'Сенсор 1'}
				color={Object.values(SENSOR_CONFIG)[0]?.color}
				value={sensorValues[0]}
				bound={sensorBounds[0]}
				onClick={() => handleSensorClick(0)}
				unit="°C"
				isActive={(drivesStatus & 1) === 1}
			/>

			<SensorPanel
				label={Object.values(SENSOR_CONFIG)[1]?.label || 'Сенсор 2'}
				color={Object.values(SENSOR_CONFIG)[1]?.color}
				value={sensorValues[1]}
				onClick={() => handleSensorClick(1)}
				bound={sensorBounds[1]}
				unit="°C"
				isActive={(drivesStatus & 2) === 2}
			/>

			<SensorPanel
				label={Object.values(SENSOR_CONFIG)[2]?.label || 'Сенсор 3'}
				color={Object.values(SENSOR_CONFIG)[2]?.color}
				onClick={() => handleSensorClick(2)}
				bound={sensorBounds[2]}
				unit="°C"
				isActive={(drivesStatus & 4) === 4}
			/>

			<SensorPanel
				label={Object.values(SENSOR_CONFIG)[3]?.label || 'Сенсор 4'}
				color={Object.values(SENSOR_CONFIG)[3]?.color}
				value={sensorValues[3]}
				onClick={() => handleSensorClick(3)}
				bound={sensorBounds[3]}
				unit="°C"
				isActive={(drivesStatus & 8) === 8}
			/>

			<SensorPanel label="Давление" isPressure value={adValue} color="purple" unit="мм рт.ст." />

			<SensorConfigDialog
				open={sensorDialogOpen}
				onOpenChange={setSensorDialogOpen}
				sensorIndex={selectedSensor}
				sensorName={
					Object.values(SENSOR_CONFIG)[selectedSensor]?.label || `Сенсор ${selectedSensor + 1}`
				}
				currentValue={sensorValues[selectedSensor]}
				currentBound={sensorBounds[selectedSensor]}
				currentReaction={receivedData?.Reaction?.[selectedSensor]}
				onSave={handleSensorSave}
			/>
		</div>
	)
}

export default SensorsPanel
