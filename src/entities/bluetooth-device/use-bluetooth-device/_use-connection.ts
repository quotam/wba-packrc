'use client'

import { useCallback } from 'react'

import { COMMON_SERIAL_SERVICES, DiscoveredCharacteristics } from '@front/shared/lib/utils'

export function useBluetoothConnection() {
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

	return { autoDiscoverSerialService }
}
