'use client'

import { useDevice } from '@front/entities/bluetooth-device/context'
import { Button } from '@front/shared/ui/button'
import { Bluetooth, BluetoothOff } from 'lucide-react'

const DeviceState = () => {
	const { isConnected, connect, disconnect, connectionStatus } = useDevice()

	return (
		<div className="flex items-center gap-4">
			<div className="flex items-center gap-2 ml-2">
				<div
					className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-400' : 'bg-destructive'} animate-pulse`}
				/>
				<span className="text-sm uppercase flex-1 line-clamp-1">{connectionStatus} </span>
			</div>

			{!isConnected ? (
				<Button onClick={connect} size="lg" className="gap-2">
					<Bluetooth className="w-5 h-5" />
					<span className="xs:max-w-20 truncate">Подключить устройство</span>
				</Button>
			) : (
				<Button onClick={disconnect} variant="destructive" size="lg" className="gap-2">
					<BluetoothOff className="w-5 h-5" />
					Отключить
				</Button>
			)}
		</div>
	)
}

export default DeviceState
