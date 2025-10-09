import { ReceivedData } from '@front/kernel/domain/types'

const parseWPacket = (data: string): Partial<ReceivedData> => {
	const payload = data.substring(2)

	const convertD = (str: string, start: number, len: number): number => {
		const hex = str.substring(start, start + len)
		return Number.parseInt(hex, 16)
	}

	let pos = 0
	const result: Partial<ReceivedData> = {
		SensorValue: [
			((convertD(payload, pos, 4) << 16) >> 16) / 16,
			((convertD(payload, (pos += 4), 4) << 16) >> 16) / 16,
			((convertD(payload, (pos += 4), 4) << 16) >> 16) / 16,
			((convertD(payload, (pos += 4), 4) << 16) >> 16) / 16
		] as [number, number, number, number],
		SensorBound: [
			((convertD(payload, (pos += 4), 4) << 16) >> 16) / 16,
			((convertD(payload, (pos += 4), 4) << 16) >> 16) / 16,
			((convertD(payload, (pos += 4), 4) << 16) >> 16) / 16,
			((convertD(payload, (pos += 4), 4) << 16) >> 16) / 16
		] as [number, number, number, number],
		ADValue: convertD(payload, (pos += 4), 8) / 133.33333,
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
		Rate: (convertD(payload, (pos += 8), 4) << 16) >> 16,
		Dose: (convertD(payload, (pos += 4), 4) << 16) >> 16
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
	result.HeatControlValue = convertD(payload, (pos += 2), 4) / 16

	if (result.stepsFor100) {
		result.Total = Math.round((100 * (result.stepcounter || 0)) / result.stepsFor100)
		result.Remain = Math.round((100 * (result.backstepcount || 0)) / result.stepsFor100)

		if (result.Rate && result.Rate !== 0) {
			result.RemainT = Math.round(
				(360000 * (result.backstepcount || 0)) / (result.Rate * result.stepsFor100)
			)
		} else {
			result.RemainT = 0
		}
	}

	return result
}

const parseTPacket = (data: string): Partial<ReceivedData> => {
	const payload = data.substring(2)

	return {
		SensorValue: [
			((Number.parseInt(payload.substring(0, 4), 16) << 16) >> 16) * 0.0625,
			((Number.parseInt(payload.substring(4, 8), 16) << 16) >> 16) * 0.0625,
			((Number.parseInt(payload.substring(8, 12), 16) << 16) >> 16) * 0.0625,
			((Number.parseInt(payload.substring(12, 16), 16) << 16) >> 16) * 0.0625
		] as [number, number, number, number],
		SensorBound: [
			((Number.parseInt(payload.substring(16, 20), 16) << 16) >> 16) * 0.0625,
			((Number.parseInt(payload.substring(20, 24), 16) << 16) >> 16) * 0.0625,
			((Number.parseInt(payload.substring(24, 28), 16) << 16) >> 16) * 0.0625,
			((Number.parseInt(payload.substring(28, 32), 16) << 16) >> 16) * 0.0625
		] as [number, number, number, number],
		ADValue: Number.parseInt(payload.substring(32, 38), 16) / 133.333333,
		Rate: Number.parseInt(payload.substring(38, 42), 16),
		Total: Number.parseInt(payload.substring(42, 47), 16),
		Dose: Number.parseInt(payload.substring(47, 51), 16),
		Remain: Number.parseInt(payload.substring(51, 55), 16),
		DrivesStatus: Number.parseInt(payload.substring(55, 56), 16),
		Reaction: [
			Number.parseInt(payload.substring(56, 57), 16),
			Number.parseInt(payload.substring(57, 58), 16),
			Number.parseInt(payload.substring(58, 59), 16),
			Number.parseInt(payload.substring(59, 60), 16)
		] as [number, number, number, number],
		AFlagsStatus: Number.parseInt(payload.substring(60, 61), 16),
		TargetV: Number.parseInt(payload.substring(61, 65), 16) / 10,
		MeasuredV: Number.parseInt(payload.substring(65, 69), 16) / 10,
		StabModeNo: Number.parseInt(payload.substring(69, 70), 16),
		HeatControlStatus: Number.parseInt(payload.substring(70, 71), 16),
		HeatControlSensorNo: Number.parseInt(payload.substring(71, 72), 16),
		HeatControlValue: Number.parseInt(payload.substring(72, 76), 16) / 16
	}
}

const parseUPacket = (data: string): Partial<ReceivedData> => {
	const payload = data.substring(2)

	return {
		TargetV: Number.parseInt(payload.substring(0, 4), 16) / 10,
		MeasuredV: Number.parseInt(payload.substring(4, 8), 16) / 10,
		StabModeNo: Number.parseInt(payload.substring(8, 9), 16),
		IsInRange: Number.parseInt(payload.substring(9, 10), 16),
		IsMaxU: Number.parseInt(payload.substring(10, 11), 16)
	}
}

const parseVPacket = (data: string): Partial<ReceivedData> => {
	const payload = data.substring(2)

	return {
		Dose: Number.parseInt(payload.substring(0, 4), 16),
		Remain: Number.parseInt(payload.substring(4, 8), 16)
	}
}

const parseZPacket = (data: string): Partial<ReceivedData> => {
	const payload = data.substring(2)

	return {
		stepsFor100: Number.parseInt(payload.substring(0, 8), 16)
	}
}

export const parsePacket = (data: string) => {
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
		console.error('Error parsing packet:', error)
	}

	return null
}
