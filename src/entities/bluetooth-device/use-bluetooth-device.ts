'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { ReceivedData } from '@front/kernel/domain/types'

import { parsePacket } from './parser'

const SERVICE_UUID = '0000ffe0-0000-1000-8000-00805f9b34fb'
const TX_CHARACTERISTIC_UUID = '0000ffe1-0000-1000-8000-00805f9b34fb'
const RX_CHARACTERISTIC_UUID = '0000ffe2-0000-1000-8000-00805f9b34fb'

const UI_UPDATE_THROTTLE_MS = 100 // Update UI max 10 times per second

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
		[parsePacket, updateReceivedData]
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

	const connect = useCallback(async () => {
		try {
			setConnectionStatus('Поиск устройства...')

			const device = await navigator.bluetooth.requestDevice({
				filters: [{ services: [SERVICE_UUID] }],
				optionalServices: [SERVICE_UUID]
			})

			console.log('Device selected:', device.name, device.id)

			device.addEventListener('gattserverdisconnected', handleDisconnect)

			setDevice(device)
			setConnectionStatus('Подключение...')

			const server = await device.gatt?.connect()
			if (!server) throw new Error('Failed to connect to GATT server')

			console.log('Connected to GATT server')

			const service = await server.getPrimaryService(SERVICE_UUID)
			console.log('Got service:', service.uuid)

			const characteristics = await service.getCharacteristics()
			console.log('Available characteristics:')
			for (const char of characteristics) {
				console.log(`  - ${char.uuid}`)
				console.log(`    Properties:`, {
					broadcast: char.properties.broadcast,
					read: char.properties.read,
					writeWithoutResponse: char.properties.writeWithoutResponse,
					write: char.properties.write,
					notify: char.properties.notify,
					indicate: char.properties.indicate
				})
			}

			const txCharacteristic = await service.getCharacteristic(TX_CHARACTERISTIC_UUID)
			const rxCharacteristic = await service.getCharacteristic(RX_CHARACTERISTIC_UUID)

			console.log('TX Characteristic properties:', {
				read: txCharacteristic.properties.read,
				write: txCharacteristic.properties.write,
				writeWithoutResponse: txCharacteristic.properties.writeWithoutResponse,
				notify: txCharacteristic.properties.notify
			})

			console.log('RX Characteristic properties:', {
				read: rxCharacteristic.properties.read,
				write: rxCharacteristic.properties.write,
				writeWithoutResponse: rxCharacteristic.properties.writeWithoutResponse,
				notify: rxCharacteristic.properties.notify
			})

			txCharacteristicRef.current = txCharacteristic
			rxCharacteristicRef.current = rxCharacteristic

			if (txCharacteristic.properties.notify) {
				await txCharacteristic.startNotifications()
				txCharacteristic.addEventListener(
					'characteristicvaluechanged',
					handleCharacteristicValueChanged
				)
				console.log('Started notifications on TX characteristic')
			} else {
				console.warn('TX characteristic does not support notifications')
			}

			setIsConnected(true)
			setConnectionStatus('Подключено')

			await sendCommand('Z0\r')
		} catch (error) {
			console.error('Bluetooth connection error:', error)
			setConnectionStatus(`Ошибка: ${error instanceof Error ? error.message : String(error)}`)
			setIsConnected(false)
		}
	}, [handleCharacteristicValueChanged, handleDisconnect])

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

			console.log('Attempting to send command:', cmd.replace('\r', '\\r'))
			console.log('Command bytes:', Array.from(data))

			if (rxCharacteristicRef.current.properties.writeWithoutResponse) {
				await rxCharacteristicRef.current.writeValueWithoutResponse(data)
				console.log('Sent command using writeValueWithoutResponse')
			} else if (rxCharacteristicRef.current.properties.write) {
				await rxCharacteristicRef.current.writeValue(data)
				console.log('Sent command using writeValue')
			} else {
				console.error('Characteristic does not support write operations')
				return
			}

			console.log('Command sent successfully:', cmd.replace('\r', '\\r'))
		} catch (error) {
			console.error('Error sending command:', error)
			console.error('Error details:', {
				name: error instanceof Error ? error.name : 'Unknown',
				message: error instanceof Error ? error.message : String(error)
			})
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
