import { ReceivedData } from '@front/kernel/domain/types'

const safeParseInt = (str: string, radix = 16): number => {
	const value = Number.parseInt(str, radix)
	return Number.isNaN(value) ? 0 : value
}

const safeDivide = (numerator: number, denominator: number): number => {
	if (denominator === 0 || !Number.isFinite(denominator) || !Number.isFinite(numerator)) {
		return 0
	}
	const result = numerator / denominator
	return Number.isFinite(result) ? result : 0
}

const toSigned16 = (value: number): number => {
	return (value << 16) >> 16
}

const parseWPacket = (data: string): Partial<ReceivedData> => {
	const payload = data.substring(2)

	const convertD = (str: string, start: number, len: number): number => {
		// Validate bounds
		if (start < 0 || start + len > str.length) {
			return 0
		}

		// reverses the byte order (little-endian)
		let hex = ''
		for (let i = start + len - 1; i >= start; i--) {
			hex += str[i]
		}
		return safeParseInt(hex, 16)
	}

	let pos = 0
	const result: Partial<ReceivedData> = {
		SensorValue: [
			safeDivide(toSigned16(convertD(payload, pos, 4)), 16),
			safeDivide(toSigned16(convertD(payload, (pos += 4), 4)), 16),
			safeDivide(toSigned16(convertD(payload, (pos += 4), 4)), 16),
			safeDivide(toSigned16(convertD(payload, (pos += 4), 4)), 16)
		] as [number, number, number, number],
		SensorBound: [
			safeDivide(toSigned16(convertD(payload, (pos += 4), 4)), 16),
			safeDivide(toSigned16(convertD(payload, (pos += 4), 4)), 16),
			safeDivide(toSigned16(convertD(payload, (pos += 4), 4)), 16),
			safeDivide(toSigned16(convertD(payload, (pos += 4), 4)), 16)
		] as [number, number, number, number],
		ADValue: safeDivide(convertD(payload, (pos += 4), 8), 133.33333),
		Reaction: [
			convertD(payload, (pos += 8), 2),
			convertD(payload, (pos += 2), 2),
			convertD(payload, (pos += 2), 2),
			convertD(payload, (pos += 2), 2)
		] as [number, number, number, number],
		AFlagsStatus: convertD(payload, (pos += 2), 2),
		DrivesStatus: convertD(payload, (pos += 2), 2),
		stepcounter: convertD(payload, (pos += 2), 8),
		backstepcount: convertD(payload, (pos += 8), 8),
		stepsFor100: convertD(payload, (pos += 8), 8),
		Rate: toSigned16(convertD(payload, (pos += 8), 4)),
		Dose: toSigned16(convertD(payload, (pos += 4), 4))
	}

	convertD(payload, (pos += 4), 2) // AA
	const BB = convertD(payload, (pos += 2), 2)
	result.StabModeNo = BB & 0x03
	result.CCCC = convertD(payload, (pos += 2), 4)
	result.TargetV = result.CCCC
	result.DDDD = convertD(payload, (pos += 4), 4)
	result.EEEE = convertD(payload, (pos += 4), 4)
	result.FFFF = convertD(payload, (pos += 4), 4)

	result.HeatControlSensorNo = convertD(payload, (pos += 4), 2)
	result.HeatControlStatus = convertD(payload, (pos += 2), 2)
	result.HeatControlValue = safeDivide(convertD(payload, (pos += 2), 4), 16)

	if (result.stepsFor100 && result.stepsFor100 > 0) {
		result.Total = Math.round(safeDivide(100 * (result.stepcounter || 0), result.stepsFor100))
		result.Remain = Math.round(safeDivide(100 * (result.backstepcount || 0), result.stepsFor100))

		if (result.Rate && result.Rate !== 0) {
			result.RemainT = Math.round(
				safeDivide(360000 * (result.backstepcount || 0), result.Rate * result.stepsFor100)
			)
		} else {
			result.RemainT = 0
		}
	}

	return result
}

const parseTPacket = (data: string): Partial<ReceivedData> => {
	const payload = data.substring(2)

	if (payload.length < 76) {
		console.warn('T packet too short:', payload.length)
		return {}
	}

	return {
		SensorValue: [
			toSigned16(safeParseInt(payload.substring(0, 4))) * 0.0625,
			toSigned16(safeParseInt(payload.substring(4, 8))) * 0.0625,
			toSigned16(safeParseInt(payload.substring(8, 12))) * 0.0625,
			toSigned16(safeParseInt(payload.substring(12, 16))) * 0.0625
		] as [number, number, number, number],
		SensorBound: [
			toSigned16(safeParseInt(payload.substring(16, 20))) * 0.0625,
			toSigned16(safeParseInt(payload.substring(20, 24))) * 0.0625,
			toSigned16(safeParseInt(payload.substring(24, 28))) * 0.0625,
			toSigned16(safeParseInt(payload.substring(28, 32))) * 0.0625
		] as [number, number, number, number],
		ADValue: safeDivide(safeParseInt(payload.substring(32, 38)), 133.333333),
		Rate: safeParseInt(payload.substring(38, 42)),
		Total: safeParseInt(payload.substring(42, 47)),
		Dose: safeParseInt(payload.substring(47, 51)),
		Remain: safeParseInt(payload.substring(51, 55)),
		DrivesStatus: safeParseInt(payload.substring(55, 56)),
		Reaction: [
			safeParseInt(payload.substring(56, 57)),
			safeParseInt(payload.substring(57, 58)),
			safeParseInt(payload.substring(58, 59)),
			safeParseInt(payload.substring(59, 60))
		] as [number, number, number, number],
		AFlagsStatus: safeParseInt(payload.substring(60, 61)),
		TargetV: safeDivide(safeParseInt(payload.substring(61, 65)), 10),
		MeasuredV: safeDivide(safeParseInt(payload.substring(65, 69)), 10),
		StabModeNo: safeParseInt(payload.substring(69, 70)),
		HeatControlStatus: safeParseInt(payload.substring(70, 71)),
		HeatControlSensorNo: safeParseInt(payload.substring(71, 72)),
		HeatControlValue: safeDivide(safeParseInt(payload.substring(72, 76)), 16)
	}
}

const parseUPacket = (data: string): Partial<ReceivedData> => {
	const payload = data.substring(2)

	if (payload.length < 11) {
		console.warn('U packet too short:', payload.length)
		return {}
	}

	return {
		TargetV: safeDivide(safeParseInt(payload.substring(0, 4)), 10),
		MeasuredV: safeDivide(safeParseInt(payload.substring(4, 8)), 10),
		StabModeNo: safeParseInt(payload.substring(8, 9)),
		IsInRange: safeParseInt(payload.substring(9, 10)),
		IsMaxU: safeParseInt(payload.substring(10, 11))
	}
}

const parseVPacket = (data: string): Partial<ReceivedData> => {
	const payload = data.substring(2)

	if (payload.length < 8) {
		console.warn('V packet too short:', payload.length)
		return {}
	}

	return {
		Dose: safeParseInt(payload.substring(0, 4)),
		Remain: safeParseInt(payload.substring(4, 8))
	}
}

const parseZPacket = (data: string): Partial<ReceivedData> => {
	const payload = data.substring(2)

	if (payload.length < 8) {
		console.warn('Z packet too short:', payload.length)
		return {}
	}

	return {
		stepsFor100: safeParseInt(payload.substring(0, 8))
	}
}

export const parsePacket = (data: string) => {
	if (!data || data.length < 2) {
		return null
	}

	const prefix = data[0]

	try {
		if (prefix === 'W') {
			return parseWPacket(data)
		} else if (prefix === 'T') {
			return parseTPacket(data)
		} else if (prefix === 'U') {
			return parseUPacket(data)
		} else if (prefix === 'V') {
			return parseVPacket(data)
		} else if (prefix === 'Z') {
			return parseZPacket(data)
		}
	} catch (error) {
		console.error('Error parsing packet:', error, 'Data:', data)
	}

	return null
}
