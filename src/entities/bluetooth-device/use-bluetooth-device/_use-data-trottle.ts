'use client'

import type React from 'react'
import { useCallback, useRef } from 'react'

import type { ReceivedData } from '@front/kernel/domain/types'
import { UI_UPDATE_THROTTLE_MS, sanitizeNumber, sanitizeNumberArray } from '@front/shared/lib/utils'

export function useDataThrottle(
	setReceivedData: React.Dispatch<React.SetStateAction<ReceivedData | null>>
) {
	const lastUpdateTimeRef = useRef<number>(0)
	const pendingDataRef = useRef<Partial<ReceivedData> | null>(null)
	const updateTimerRef = useRef<NodeJS.Timeout | null>(null)
	const rafHandleRef = useRef<number | null>(null)

	const updateReceivedData = useCallback(
		(newData: Partial<ReceivedData>) => {
			// Validate and sanitize incoming data
			const sanitizedData: Partial<ReceivedData> = {}

			//TODO: replace that shit
			for (const [key, value] of Object.entries(newData)) {
				if (Array.isArray(value)) {
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					sanitizedData[key as keyof ReceivedData] = sanitizeNumberArray(value) as any
				} else if (typeof value === 'number') {
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					sanitizedData[key as keyof ReceivedData] = sanitizeNumber(value) as any
				} else {
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					sanitizedData[key as keyof ReceivedData] = value as any
				}
			}

			// Merge with pending data
			pendingDataRef.current = { ...pendingDataRef.current, ...sanitizedData }

			const now = Date.now()
			const timeSinceLastUpdate = now - lastUpdateTimeRef.current

			if (timeSinceLastUpdate >= UI_UPDATE_THROTTLE_MS) {
				// Cancel any pending RAF
				if (rafHandleRef.current !== null) {
					cancelAnimationFrame(rafHandleRef.current)
					rafHandleRef.current = null
				}

				// Use RAF for smoother updates on mobile
				rafHandleRef.current = requestAnimationFrame(() => {
					if (pendingDataRef.current) {
						setReceivedData(prev => ({ ...prev, ...pendingDataRef.current }) as ReceivedData)
						pendingDataRef.current = null
						lastUpdateTimeRef.current = Date.now()
					}
					rafHandleRef.current = null
				})

				if (updateTimerRef.current) {
					clearTimeout(updateTimerRef.current)
					updateTimerRef.current = null
				}
			} else if (!updateTimerRef.current) {
				const delay = UI_UPDATE_THROTTLE_MS - timeSinceLastUpdate
				updateTimerRef.current = setTimeout(() => {
					if (rafHandleRef.current !== null) {
						cancelAnimationFrame(rafHandleRef.current)
						rafHandleRef.current = null
					}

					rafHandleRef.current = requestAnimationFrame(() => {
						if (pendingDataRef.current) {
							setReceivedData(prev => ({ ...prev, ...pendingDataRef.current }) as ReceivedData)
							pendingDataRef.current = null
							lastUpdateTimeRef.current = Date.now()
						}
						rafHandleRef.current = null
					})
					updateTimerRef.current = null
				}, delay)
			}
		},
		[setReceivedData]
	)

	const cleanup = useCallback(() => {
		if (rafHandleRef.current !== null) {
			cancelAnimationFrame(rafHandleRef.current)
			rafHandleRef.current = null
		}
		if (updateTimerRef.current) {
			clearTimeout(updateTimerRef.current)
			updateTimerRef.current = null
		}
		pendingDataRef.current = null
	}, [])

	return { updateReceivedData, cleanup }
}
