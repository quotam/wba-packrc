'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import type { ReceivedData } from '@front/kernel/domain/types'
import { COMMON_SERIAL_SERVICES } from '@front/shared/lib/utils'

import { useBluetoothDataHandler } from './_recived-data-handler'
import { useBluetoothConnection } from './_use-connection'
import { useDataThrottle } from './_use-data-trottle'

export function useBluetoothDevice() {
	const [isConnected, setIsConnected] = useState(false)
	const [device, setDevice] = useState<BluetoothDevice | null>(null)
	const [receivedData, setReceivedData] = useState<ReceivedData | null>(null)
	const [connectionStatus, setConnectionStatus] = useState('Не подключено')

	const txCharacteristicRef = useRef<BluetoothRemoteGATTCharacteristic | null>(null)
	const rxCharacteristicRef = useRef<BluetoothRemoteGATTCharacteristic | null>(null)

	const { updateReceivedData, cleanup: cleanupThrottle } = useDataThrottle(setReceivedData)
	const { handleCharacteristicValueChanged, clearBuffer } =
		useBluetoothDataHandler(updateReceivedData)
	const { autoDiscoverSerialService } = useBluetoothConnection()

	const handleDisconnect = useCallback(() => {
		console.log('Device disconnected')
		setIsConnected(false)
		setConnectionStatus('Потеря связи')
		txCharacteristicRef.current = null
		rxCharacteristicRef.current = null
		clearBuffer()
		cleanupThrottle()
	}, [clearBuffer, cleanupThrottle])

	const connect = useCallback(async () => {
		try {
			setConnectionStatus('Поиск устройства...')

			const device = await navigator.bluetooth.requestDevice({
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
		clearBuffer()
		cleanupThrottle()
	}, [device, handleDisconnect, clearBuffer, cleanupThrottle])

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
			cleanupThrottle()
			if (device) {
				device.removeEventListener('gattserverdisconnected', handleDisconnect)
			}
			if (device?.gatt?.connected) {
				device.gatt.disconnect()
			}
		}
	}, [device, handleDisconnect, cleanupThrottle])

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
