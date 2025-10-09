'use client'

import { useEffect, useRef, useState } from 'react'

import { ChartDataPoint, ReceivedData } from '@front/kernel/domain/types'

import { isValidPressure, isValidTemperature } from './validation'

const MAX_CHART_POINTS = 600 // 10 minutes at 1 second intervals

export function useDataLogger(receivedData: ReceivedData | null) {
	const [chartData, setChartData] = useState<ChartDataPoint[]>([])
	const dbRef = useRef<IDBDatabase | null>(null)

	useEffect(() => {
		const initDB = async () => {
			const request = indexedDB.open('DistillationDB', 1)

			request.onerror = () => {
				console.error('IndexedDB error:', request.error)
			}

			request.onsuccess = () => {
				dbRef.current = request.result
				console.log('IndexedDB initialized')
			}

			request.onupgradeneeded = event => {
				const db = (event.target as IDBOpenDBRequest).result

				if (!db.objectStoreNames.contains('measurements')) {
					const store = db.createObjectStore('measurements', { keyPath: 'timestamp' })
					store.createIndex('timestamp', 'timestamp', { unique: true })
				}
			}
		}

		initDB()

		return () => {
			if (dbRef.current) {
				dbRef.current.close()
			}
		}
	}, [])

	useEffect(() => {
		if (!receivedData) return

		const now = new Date()
		const timeStr = now.toLocaleTimeString('ru-RU', {
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit'
		})

		const T0 = receivedData.SensorValue?.[0]
		const T1 = receivedData.SensorValue?.[1]
		const T2 = receivedData.SensorValue?.[2]
		const T3 = receivedData.SensorValue?.[3]
		const AD = receivedData.ADValue

		const dataPoint: ChartDataPoint = {
			time: timeStr,
			timestamp: now.getTime(),
			T0: isValidTemperature(T0) ? T0 : null,
			T1: isValidTemperature(T1) ? T1 : null,
			T2: isValidTemperature(T2) ? T2 : null,
			T3: isValidTemperature(T3) ? T3 : null,
			AD: isValidPressure(AD) ? AD : null
		}

		// Update chart data
		setChartData(prev => {
			const newData = [...prev, dataPoint]
			if (newData.length > MAX_CHART_POINTS) {
				return newData.slice(-MAX_CHART_POINTS)
			}
			return newData
		})

		// Save to IndexedDB
		if (dbRef.current) {
			const transaction = dbRef.current.transaction(['measurements'], 'readwrite')
			const store = transaction.objectStore('measurements')

			const record = {
				timestamp: now.getTime(),
				...receivedData
			}

			store.add(record).onsuccess = () => {
				console.log('Data logged to IndexedDB')
			}
		}
	}, [receivedData])

	const logData = (data: ReceivedData) => {
		console.log('Manual log:', data)
	}

	return {
		logData,
		chartData
	}
}
