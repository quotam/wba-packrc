'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { ReceivedData } from '@front/kernel/domain/types'

import { parsePacket } from './parser'

const UI_UPDATE_THROTTLE_MS = 100 // Update UI max 10 times per second

const COMMON_SERIAL_SERVICES = [
	'0000ffe0-0000-1000-8000-00805f9b34fb', // HM-10, HC-08 modules
	'6e400001-b5a3-f393-e0a9-e50e24dcca9e', // Nordic UART Service
	'49535343-fe7d-4ae5-8fa9-9fafd205e455' // Microchip Transparent UART
]

interface DiscoveredCharacteristics {
	service: BluetoothRemoteGATTService
	txChar: BluetoothRemoteGATTCharacteristic // For receiving data (notify)
	rxChar: BluetoothRemoteGATTCharacteristic // For sending data (write)
}

export function useBluetoothDevice() {
	const [isConnected, setIsConnected] = useState(false)
	const [device, setDevice] = useState<BluetoothDevice | null>(null)
	const [receivedData, setReceivedData] = useState<ReceivedData | null>(null)
	const [connectionStatus, setConnectionStatus] = useState('Не подключено')

	const txCharacteristicRef = useRef<BluetoothRemoteGATTCharacteristic | null>(null)
	const rxCharacteristicRef = useRef<BluetoothRemoteGATTCharacteristic | null>(null)
	const bufferRef = useRef<string>('')

	const lastUpdateTimeRef = useRef<number>(0)
	const pendingDataRef = useRef<Partial<ReceivedData> | null>(null)
	const updateTimerRef = useRef<NodeJS.Timeout | null>(null)

	const updateReceivedData = useCallback((newData: Partial<ReceivedData>) => {
		const now = Date.now()
		const timeSinceLastUpdate = now - lastUpdateTimeRef.current

		pendingDataRef.current = { ...pendingDataRef.current, ...newData }

		if (timeSinceLastUpdate >= UI_UPDATE_THROTTLE_MS) {
			setReceivedData(prev => ({ ...prev, ...pendingDataRef.current }) as ReceivedData)
			pendingDataRef.current = null
			lastUpdateTimeRef.current = now

			if (updateTimerRef.current) {
				clearTimeout(updateTimerRef.current)
				updateTimerRef.current = null
			}
		} else if (!updateTimerRef.current) {
			const delay = UI_UPDATE_THROTTLE_MS - timeSinceLastUpdate
			updateTimerRef.current = setTimeout(() => {
				if (pendingDataRef.current) {
					setReceivedData(prev => ({ ...prev, ...pendingDataRef.current }) as ReceivedData)
					pendingDataRef.current = null
					lastUpdateTimeRef.current = Date.now()
				}
				updateTimerRef.current = null
			}, delay)
		}
	}, [])

	const handleCharacteristicValueChanged = useCallback(
		(event: Event) => {
			const target = event.target as BluetoothRemoteGATTCharacteristic
			const value = target.value

			if (!value) return

			const decoder = new TextDecoder()
			const text = decoder.decode(value)

			bufferRef.current += text

			const packets = bufferRef.current.split('\r')
			bufferRef.current = packets.pop() || ''

			for (const packet of packets) {
				if (packet.length > 0) {
					const parsed = parsePacket(packet.trim().replace('<', '').replace('>', ''))
					if (parsed) {
						updateReceivedData(parsed)
					}
				}
			}

			if (bufferRef.current.length > 1000) {
				console.warn('Buffer overflow, clearing')
				bufferRef.current = ''
			}
		},
		[updateReceivedData]
	)

	const handleDisconnect = useCallback(() => {
		console.log('Device disconnected')
		setIsConnected(false)
		setConnectionStatus('Потеря связи')
		txCharacteristicRef.current = null
		rxCharacteristicRef.current = null
		bufferRef.current = ''

		if (updateTimerRef.current) {
			clearTimeout(updateTimerRef.current)
			updateTimerRef.current = null
		}
		pendingDataRef.current = null
	}, [])

	const discoverSerialCharacteristics = useCallback(
		async (service: BluetoothRemoteGATTService): Promise<DiscoveredCharacteristics | null> => {
			try {
				const characteristics = await service.getCharacteristics()
				console.log(`Service ${service.uuid} has ${characteristics.length} characteristics`)

				let txChar: BluetoothRemoteGATTCharacteristic | null = null
				let rxChar: BluetoothRemoteGATTCharacteristic | null = null

				// Look for characteristics with the right properties
				for (const char of characteristics) {
					console.log(`Characteristic ${char.uuid}:`, {
						notify: char.properties.notify,
						write: char.properties.write,
						writeWithoutResponse: char.properties.writeWithoutResponse
					})

					// TX characteristic: should support notify (for receiving data)
					if (char.properties.notify && !txChar) {
						txChar = char
						console.log(`Found TX (notify) characteristic: ${char.uuid}`)
					}

					// RX characteristic: should support write (for sending data)
					if ((char.properties.write || char.properties.writeWithoutResponse) && !rxChar) {
						rxChar = char
						console.log(`Found RX (write) characteristic: ${char.uuid}`)
					}
				}

				if (txChar && rxChar) {
					console.log('Successfully discovered serial characteristics')
					return { service, txChar, rxChar }
				}

				return null
			} catch (error) {
				console.error(`Error discovering characteristics for service ${service.uuid}:`, error)
				return null
			}
		},
		[]
	)

	const autoDiscoverSerialService = useCallback(
		async (server: BluetoothRemoteGATTServer): Promise<DiscoveredCharacteristics | null> => {
			console.log('Starting auto-discovery of serial service...')

			// First, try common serial service UUIDs
			for (const serviceUuid of COMMON_SERIAL_SERVICES) {
				try {
					console.log(`Trying known serial service: ${serviceUuid}`)
					const service = await server.getPrimaryService(serviceUuid)
					const discovered = await discoverSerialCharacteristics(service)
					if (discovered) {
						console.log(`Found working serial service: ${serviceUuid}`)
						return discovered
					}
				} catch (error) {
					console.log(`Service ${serviceUuid} not available`, error)
				}
			}

			// If common services didn't work, scan all available services
			console.log('Scanning all available services...')
			try {
				const services = await server.getPrimaryServices()
				console.log(`Found ${services.length} services total`)

				for (const service of services) {
					console.log(`Checking service: ${service.uuid}`)
					const discovered = await discoverSerialCharacteristics(service)
					if (discovered) {
						console.log(`Found working serial service: ${service.uuid}`)
						return discovered
					}
				}
			} catch (error) {
				console.error('Error scanning services:', error)
			}

			console.error('Could not find suitable serial characteristics')
			return null
		},
		[discoverSerialCharacteristics]
	)

	const connect = useCallback(async () => {
		try {
			setConnectionStatus('Поиск устройства...')

			const device = await navigator.bluetooth.requestDevice({
				// acceptAllDevices: true, // This would show ALL Bluetooth devices
				// optionalServices: COMMON_SERIAL_SERVICES, // Allow access to these services
				filters: COMMON_SERIAL_SERVICES.map(uuid => ({ services: [uuid] })),
				optionalServices: COMMON_SERIAL_SERVICES
			})

			console.log('Device selected:', device.name, device.id)

			device.addEventListener('gattserverdisconnected', handleDisconnect)

			setDevice(device)
			setConnectionStatus('Подключение...')

			const server = await device.gatt?.connect()
			if (!server) throw new Error('Failed to connect to GATT server')

			console.log('Connected to GATT server')

			setConnectionStatus('Поиск характеристик...')
			const discovered = await autoDiscoverSerialService(server)

			if (!discovered) {
				throw new Error('Не удалось найти подходящие характеристики для последовательной связи')
			}

			const { txChar, rxChar } = discovered

			console.log('Using characteristics:', {
				tx: txChar.uuid,
				rx: rxChar.uuid
			})

			txCharacteristicRef.current = txChar
			rxCharacteristicRef.current = rxChar

			if (txChar.properties.notify) {
				await txChar.startNotifications()
				txChar.addEventListener('characteristicvaluechanged', handleCharacteristicValueChanged)
				console.log('Started notifications on TX characteristic')
			} else {
				throw new Error('TX characteristic does not support notifications')
			}

			setIsConnected(true)
			setConnectionStatus('Подключено')

			await sendCommand('Z0\r')
		} catch (error) {
			console.error('Bluetooth connection error:', error)
			setConnectionStatus(`Ошибка: ${error instanceof Error ? error.message : String(error)}`)
			setIsConnected(false)
		}
	}, [handleCharacteristicValueChanged, handleDisconnect, autoDiscoverSerialService])

	const disconnect = useCallback(async () => {
		if (device) {
			device.removeEventListener('gattserverdisconnected', handleDisconnect)
		}

		if (device?.gatt?.connected) {
			device.gatt.disconnect()
		}
		setIsConnected(false)
		setDevice(null)
		setConnectionStatus('Отключено')
		txCharacteristicRef.current = null
		rxCharacteristicRef.current = null
		bufferRef.current = ''

		if (updateTimerRef.current) {
			clearTimeout(updateTimerRef.current)
			updateTimerRef.current = null
		}
		pendingDataRef.current = null
	}, [device, handleDisconnect])

	const sendCommand = useCallback(async (command: string) => {
		if (!rxCharacteristicRef.current) {
			console.error('RX characteristic not available')
			return
		}

		try {
			const cmd = command.endsWith('\r') ? command : command + '\r'
			const encoder = new TextEncoder()
			const data = encoder.encode(cmd)

			console.log('Sending command:', cmd.replace('\r', '\\r'))

			if (rxCharacteristicRef.current.properties.writeWithoutResponse) {
				await rxCharacteristicRef.current.writeValueWithoutResponse(data)
				console.log('Sent using writeValueWithoutResponse')
			} else if (rxCharacteristicRef.current.properties.write) {
				await rxCharacteristicRef.current.writeValue(data)
				console.log('Sent using writeValue')
			} else {
				console.error('Characteristic does not support write operations')
				return
			}

			console.log('Command sent successfully')
		} catch (error) {
			console.error('Error sending command:', error)
		}
	}, [])

	useEffect(() => {
		return () => {
			if (updateTimerRef.current) {
				clearTimeout(updateTimerRef.current)
			}
			if (device) {
				device.removeEventListener('gattserverdisconnected', handleDisconnect)
			}
			if (device?.gatt?.connected) {
				device.gatt.disconnect()
			}
		}
	}, [device, handleDisconnect])

	return {
		isConnected,
		device,
		connect,
		disconnect,
		sendCommand,
		receivedData,
		connectionStatus
	}
}
