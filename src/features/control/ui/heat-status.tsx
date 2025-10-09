import { SENSOR_CONFIG } from '@front/entities/bluetooth-device/validation'
import { ReceivedData } from '@front/kernel/domain/types'

const HeatStatus = ({ data }: { data: ReceivedData | null }) => {
	if (data?.StabModeNo !== 1 && data?.HeatControlStatus !== 1) return null
	return (
		<div>
			Контроль разгона: <br /> {Object.values(SENSOR_CONFIG)[data.HeatControlSensorNo]?.label}
			{' < '}
			{data.HeatControlValue}
			<span className="ml-1">°C</span>
		</div>
	)
}

export default HeatStatus
