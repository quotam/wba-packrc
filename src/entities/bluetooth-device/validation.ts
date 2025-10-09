export const SENSOR_VALIDATION = {
	MIN_TEMP: -55,
	MAX_TEMP: 128,
	MIN_PRESSURE: 500,
	MAX_PRESSURE: 2000
} as const

export function isValidTemperature(value?: number | null): boolean {
	if (value === undefined || value === null) return false
	return value >= SENSOR_VALIDATION.MIN_TEMP && value <= SENSOR_VALIDATION.MAX_TEMP
}

export function isValidPressure(value?: number | null): boolean {
	if (value === undefined || value === null) return false
	return value >= SENSOR_VALIDATION.MIN_PRESSURE && value <= SENSOR_VALIDATION.MAX_PRESSURE
}

export function formatTemperature(value?: number | null): string {
	return isValidTemperature(value) ? value!.toFixed(2) : '--.--'
}

export function formatPressure(value?: number | null): string {
	return isValidPressure(value) ? value!.toFixed(2) : '---.--'
}

export const SENSOR_CONFIG = {
	T0: { label: 'T0 (Пар)', color: '#e0f2fe', enabled: true },
	T1: { label: 'T1 (2/3)', color: '#7dd3fc', enabled: true },
	T2: { label: 'T2 (A)', color: '#fdba74', enabled: true },
	T3: { label: 'T3 (B)', color: '#fb923c', enabled: true }
} as const

export type SensorKey = keyof typeof SENSOR_CONFIG
