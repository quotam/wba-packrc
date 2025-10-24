import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export const UI_UPDATE_THROTTLE_MS = 400 // Update UI max ~3-4 times per second for better mobile performance

export interface DiscoveredCharacteristics {
	service: BluetoothRemoteGATTService
	txChar: BluetoothRemoteGATTCharacteristic // For receiving data (notify)
	rxChar: BluetoothRemoteGATTCharacteristic // For sending data (write)
}

export const COMMON_SERIAL_SERVICES = [
	'00001101-0000-1000-8000-00805f9b34fb', // Serial Port Profile (SPP) - Classic Bluetooth Serial
	'0000ffe0-0000-1000-8000-00805f9b34fb', // HM-10, HC-08 modules
	'6e400001-b5a3-f393-e0a9-e50e24dcca9e', // Nordic UART Service (NUS)
	'49535343-fe7d-4ae5-8fa9-9fafd205e455', // Microchip Transparent UART
	'0000fff0-0000-1000-8000-00805f9b34fb' // Generic Serial Service
]

export const COMMON_TX_CHARACTERISTICS = [
	'0000ffe1-0000-1000-8000-00805f9b34fb', // HM-10 TX
	'6e400003-b5a3-f393-e0a9-e50e24dcca9e', // Nordic UART TX
	'49535343-1e4d-4bd9-ba61-23c647249616', // Microchip TX
	'0000fff1-0000-1000-8000-00805f9b34fb' // Generic TX
]

export const COMMON_RX_CHARACTERISTICS = [
	'0000ffe2-0000-1000-8000-00805f9b34fb', // HM-10 RX
	'6e400002-b5a3-f393-e0a9-e50e24dcca9e', // Nordic UART RX
	'49535343-8841-43f4-a8d4-ecbe34729bb3', // Microchip RX
	'0000fff2-0000-1000-8000-00805f9b34fb' // Generic RX
]

export interface DiscoveredCharacteristics {
	service: BluetoothRemoteGATTService
	txChar: BluetoothRemoteGATTCharacteristic // For receiving data (notify)
	rxChar: BluetoothRemoteGATTCharacteristic // For sending data (write)
}

export const sanitizeNumber = (value: number): number => {
	if (!Number.isFinite(value) || Number.isNaN(value)) {
		return 0
	}
	return value
}

export const sanitizeNumberArray = (arr: number[]): number[] => {
	return arr.map(sanitizeNumber)
}
