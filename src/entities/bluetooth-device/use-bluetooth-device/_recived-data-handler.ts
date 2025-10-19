'use client'

import { useCallback, useRef } from 'react'

import type { ReceivedData } from '@front/kernel/domain/types'

import { parsePacket } from '../parser'

export function useBluetoothDataHandler(updateReceivedData: (data: Partial<ReceivedData>) => void) {
	const bufferRef = useRef<string>('')

	const handleCharacteristicValueChanged = useCallback(
		(event: Event) => {
			const target = event.target as BluetoothRemoteGATTCharacteristic
			const value = target.value

			if (!value) return

			const decoder = new TextDecoder()
			const text = decoder.decode(value)

			bufferRef.current += text

			// Batch parsed data to reduce update calls
			const batchedData: Partial<ReceivedData> = {}
			let hasData = false

			// Find complete packets between < and >
			let startIdx = bufferRef.current.indexOf('<')

			while (startIdx !== -1) {
				const endIdx = bufferRef.current.indexOf('>', startIdx)

				if (endIdx === -1) {
					// Incomplete packet, keep in buffer starting from <
					bufferRef.current = bufferRef.current.substring(startIdx)
					break
				}

				// Extract packet content between < and > (excluding delimiters)
				const packet = bufferRef.current.substring(startIdx + 1, endIdx)

				if (packet.includes('<') || packet.includes('>')) {
					console.warn(
						'Corrupted packet detected (contains nested delimiters), discarding:',
						packet.substring(0, 50)
					)
					// Move past this corrupted packet and continue
					bufferRef.current = bufferRef.current.substring(endIdx + 1)
					startIdx = bufferRef.current.indexOf('<')
					continue
				}

				if (packet.length > 0) {
					try {
						const parsed = parsePacket(packet.trim())
						if (parsed && Object.keys(parsed).length > 0) {
							// Merge into batched data instead of calling update for each packet
							Object.assign(batchedData, parsed)
							hasData = true
						}
					} catch (error) {
						console.error('Error parsing packet:', packet.substring(0, 50), error)
					}
				}

				// Move to next potential packet
				bufferRef.current = bufferRef.current.substring(endIdx + 1)
				startIdx = bufferRef.current.indexOf('<')
			}

			// If no < found, clear buffer (no valid packet start)
			if (startIdx === -1 && bufferRef.current.indexOf('>') === -1) {
				bufferRef.current = ''
			}

			// Single update call with all batched data
			if (hasData) {
				updateReceivedData(batchedData)
			}

			if (bufferRef.current.length > 500) {
				console.warn('Buffer overflow detected, clearing buffer')
				bufferRef.current = ''
			}
		},
		[updateReceivedData]
	)

	const clearBuffer = useCallback(() => {
		bufferRef.current = ''
	}, [])

	return { handleCharacteristicValueChanged, clearBuffer }
}
