'use client'

import { type ReactNode, createContext, useContext } from 'react'

import { ReceivedData } from '@front/kernel/domain/types'

import { useBluetoothDevice } from './use-bluetooth-device'

interface BluetoothContextValue {
	isConnected: boolean
	device: BluetoothDevice | null
	connect: () => Promise<void>
	disconnect: () => Promise<void>
	sendCommand: (command: string) => Promise<void>
	receivedData: ReceivedData | null
	connectionStatus: string
}

const BluetoothContext = createContext<BluetoothContextValue | null>(null)

export function BluetoothProvider({ children }: { children: ReactNode }) {
	const bluetooth = useBluetoothDevice()

	return <BluetoothContext.Provider value={bluetooth}>{children}</BluetoothContext.Provider>
}

export function useDevice() {
	const context = useContext(BluetoothContext)
	if (!context) {
		throw new Error('useBluetooth must be used within BluetoothProvider')
	}
	return context
}
