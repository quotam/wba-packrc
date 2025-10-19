import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export const UI_UPDATE_THROTTLE_MS = 400 // Update UI max ~3-4 times per second for better mobile performance

export const COMMON_SERIAL_SERVICES = [
	'0000ffe0-0000-1000-8000-00805f9b34fb', // HM-10, HC-08 modules
	'6e400001-b5a3-f393-e0a9-e50e24dcca9e', // Nordic UART Service
	'49535343-fe7d-4ae5-8fa9-9fafd205e455' // Microchip Transparent UART
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
