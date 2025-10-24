'use client'

import { useCallback } from 'react'

import {
	COMMON_RX_CHARACTERISTICS,
	COMMON_SERIAL_SERVICES,
	COMMON_TX_CHARACTERISTICS,
	type DiscoveredCharacteristics
} from '@front/shared/lib/utils'

export function useBluetoothConnection() {
	const discoverSerialCharacteristics = useCallback(
		async (service: BluetoothRemoteGATTService): Promise<DiscoveredCharacteristics | null> => {
			try {
				const characteristics = await service.getCharacteristics()
				console.log(`Service ${service.uuid} has ${characteristics.length} characteristics`)

				let txChar: BluetoothRemoteGATTCharacteristic | null = null
				let rxChar: BluetoothRemoteGATTCharacteristic | null = null

				// Strategy 1: Try to find characteristics by known UUIDs
				for (const char of characteristics) {
					const uuid = char.uuid.toLowerCase()

					// Check if this is a known TX characteristic
					if (COMMON_TX_CHARACTERISTICS.some(txUuid => uuid === txUuid.toLowerCase())) {
						if (char.properties.notify) {
							txChar = char
							console.log(`Found known TX characteristic: ${char.uuid}`)
						}
					}

					// Check if this is a known RX characteristic
					if (COMMON_RX_CHARACTERISTICS.some(rxUuid => uuid === rxUuid.toLowerCase())) {
						if (char.properties.write || char.properties.writeWithoutResponse) {
							rxChar = char
							console.log(`Found known RX characteristic: ${char.uuid}`)
						}
					}
				}

				// Strategy 2: If we found both by UUID, return them
				if (txChar && rxChar) {
					console.log('Successfully discovered serial characteristics by UUID')
					return { service, txChar, rxChar }
				}

				// Strategy 3: Fall back to property-based detection
				console.log('Falling back to property-based detection')
				txChar = null
				rxChar = null

				for (const char of characteristics) {
					console.log(`Characteristic ${char.uuid}:`, {
						notify: char.properties.notify,
						read: char.properties.read,
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

				// Strategy 4: For some devices, TX and RX might be the same characteristic
				if (txChar && !rxChar) {
					if (txChar.properties.write || txChar.properties.writeWithoutResponse) {
						rxChar = txChar
						console.log('Using same characteristic for both TX and RX')
					}
				} else if (rxChar && !txChar) {
					if (rxChar.properties.notify) {
						txChar = rxChar
						console.log('Using same characteristic for both TX and RX')
					}
				}

				if (txChar && rxChar) {
					console.log('Successfully discovered serial characteristics by properties')
					return { service, txChar, rxChar }
				}

				console.log('Could not find suitable characteristics in this service')
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

			// Strategy 1: Try common serial service UUIDs
			for (const serviceUuid of COMMON_SERIAL_SERVICES) {
				try {
					console.log(`Trying known serial service: ${serviceUuid}`)
					const service = await server.getPrimaryService(serviceUuid)
					const discovered = await discoverSerialCharacteristics(service)
					if (discovered) {
						console.log(`✓ Found working serial service: ${serviceUuid}`)
						return discovered
					}
				} catch (error) {
					console.log(`Service ${serviceUuid} not available`)
				}
			}

			// Strategy 2: Scan all available services
			console.log('Scanning all available services...')
			try {
				const services = await server.getPrimaryServices()
				console.log(`Found ${services.length} services total`)

				for (const service of services) {
					console.log(`Checking service: ${service.uuid}`)
					const discovered = await discoverSerialCharacteristics(service)
					if (discovered) {
						console.log(`✓ Found working serial service: ${service.uuid}`)
						return discovered
					}
				}
			} catch (error) {
				console.error('Error scanning services:', error)
			}

			console.error('Could not find suitable serial characteristics in any service')
			return null
		},
		[discoverSerialCharacteristics]
	)

	return { autoDiscoverSerialService }
}
