import { useDevice } from '@front/entities/bluetooth-device/context'

export const useStatus = () => {
	const { receivedData: data } = useDevice()

	if (!data) return null

	const aFlags = data.AFlagsStatus
	const drive = data.DrivesStatus
	const stabMode = data.StabModeNo

	if (stabMode === 3) {
		return {
			text: 'Получен аварийный сигнал. Нагрев выключен, отбор остановлен.',
			color: 'text-red-500'
		}
	}

	if ((aFlags >> 2) & 1) {
		const sensors = []
		if ((drive >> 0) & 1) sensors.push('0')
		if ((drive >> 1) & 1) sensors.push('1')
		if ((drive >> 2) & 1) sensors.push('2')
		if ((drive >> 3) & 1) sensors.push('3')
		return {
			text: `Отбор остановлен. Перегрев, датчик(и) № ${sensors.join(', ')}`,
			color: 'text-orange-500'
		}
	}

	if ((aFlags >> 1) & 1) {
		return {
			text: `Автостоп по заданному объему (${data.Dose} мл). Для продолжения нажмите СТАРТ`,
			color: 'text-yellow-500'
		}
	}

	if (!((aFlags >> 0) & 1)) {
		return {
			text: 'Отбор остановлен оператором. Для продолжения нажмите СТАРТ',
			color: 'text-blue-500'
		}
	}

	if (drive !== 0 && drive < 16) {
		const sensors = []
		if ((drive >> 0) & 1) sensors.push('0')
		if ((drive >> 1) & 1) sensors.push('1')
		if ((drive >> 2) & 1) sensors.push('2')
		if ((drive >> 3) & 1) sensors.push('3')
		return {
			text: `Сработал(и) датчик(и) № ${sensors.join(', ')}. Примите меры.`,
			color: 'text-yellow-500'
		}
	}

	return { text: 'Система работает нормально', color: 'text-green-500' }
}
