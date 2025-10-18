'use client'

import { type ReactNode, createContext, useContext, useMemo } from 'react'

import { ReceivedData } from '@front/kernel/domain/types'

import { DeviceCommandClient } from './command-client'
import { useBluetoothDevice } from './use-bluetooth-device'

interface BluetoothContextValue {
	isConnected: boolean
	device: BluetoothDevice | null
	connect: () => Promise<void>
	disconnect: () => Promise<void>
	receivedData: ReceivedData | null
	connectionStatus: string
	commandClient: DeviceCommandClient
}

const BluetoothContext = createContext<BluetoothContextValue | null>(null)

export function BluetoothProvider({ children }: { children: ReactNode }) {
	const { sendCommand, ...bluetooth } = useBluetoothDevice()

	const commandClient = useMemo(() => new DeviceCommandClient(sendCommand), [sendCommand])

	return (
		<BluetoothContext.Provider value={{ ...bluetooth, commandClient }}>
			{children}
		</BluetoothContext.Provider>
	)
}

export function useDevice() {
	const context = useContext(BluetoothContext)
	if (!context) {
		throw new Error('useBluetooth must be used within BluetoothProvider')
	}
	return context
}
