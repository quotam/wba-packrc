import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react'

import { useDevice } from '@front/entities/bluetooth-device/context'
import { Button } from '@front/shared/ui/button'
import { Input } from '@front/shared/ui/input'
import { Label } from '@front/shared/ui/label'
import { SuperModal } from '@front/shared/ui/superModal'

const Form = () => {
	const { commandClient, isConnected, receivedData: data, connectionStatus } = useDevice()

	const [newStepsFor100, setNewStepsFor100] = useState<number>(0)

	const [rateInput, setRateInput] = useState('')
	const [doseInput, setDoseInput] = useState('')

	const handleStepsChange = useCallback((value: string) => {
		const steps = parseInt(value, 10)
		if (!isNaN(steps) && steps >= 0) {
			setNewStepsFor100(steps)
		}
	}, [])

	const handleSetSteps = () => {
		commandClient.pumpCalibrate(newStepsFor100)
	}

	useEffect(() => {
		if (!isConnected) return
		commandClient.sendZ0()
	}, [isConnected, commandClient, connectionStatus])

	const rate = data?.Rate ?? 0
	const dose = data?.Dose ?? 0
	const stepsFor100 = data?.stepsFor100 ?? 0

	const handleRateSubmit = () => {
		const value = Number.parseInt(rateInput)
		if (!isNaN(value) && value >= 0 && value <= 3600) {
			commandClient.setPumpRate(value)
			setRateInput('')
		}
	}

	const handleDoseSubmit = () => {
		const value = Number.parseInt(doseInput)
		commandClient.setPumpRate(value)
		setDoseInput('')
	}

	return (
		<div className="space-y-5">
			{/* Rate Control */}
			<div className="space-y-2">
				<Label htmlFor="rate">Темп отбора (мл/ч)</Label>
				<div className="flex gap-2">
					<Input
						id="rate"
						type="number"
						placeholder={rate.toString()}
						value={rateInput}
						onChange={e => setRateInput(e.target.value)}
						disabled={!isConnected}
						min={0}
						max={3600}
					/>
					<Button onClick={handleRateSubmit} disabled={!isConnected}>
						Установить
					</Button>
				</div>
			</div>

			{/* Dose Control */}
			<div className="space-y-2">
				<Label htmlFor="dose">Автостоп (мл)</Label>
				<div className="flex gap-2">
					<Input
						id="dose"
						type="number"
						placeholder={dose.toString()}
						value={doseInput}
						onChange={e => setDoseInput(e.target.value)}
						disabled={!isConnected}
						min={0}
						max={9999}
					/>
					<Button onClick={handleDoseSubmit} disabled={!isConnected}>
						Установить
					</Button>
				</div>
			</div>
			<div className="space-y-2">
				<h2 className="text-lg font-bold">Калибровка насоса</h2>
				<label htmlFor="current-steps" className="text-xs font-medium text-muted-foreground">
					Текущее количество шагов на 100:
				</label>
				<Input
					id="current-steps"
					value={stepsFor100}
					readOnly
					className="bg-muted"
					aria-label="Текущее количество шагов на 100 единиц"
				/>
			</div>

			<div className="space-y-2">
				<label htmlFor="new-steps" className="text-xs font-medium text-muted-foreground">
					Новое количество шагов на 100:
				</label>

				<div className="flex gap-2">
					<Input
						id="new-steps"
						type="number"
						min="0"
						value={newStepsFor100}
						onChange={e => handleStepsChange(e.target.value)}
						disabled={!isConnected}
						aria-label="Установить новое количество шагов на 100 единиц"
					/>
					<Button onClick={handleSetSteps} disabled={!isConnected}>
						Установить
					</Button>
				</div>
			</div>

			{!isConnected && (
				<p className="text-sm text-muted-foreground">Подключите устройство для изменения настроек</p>
			)}
		</div>
	)
}

export function PumpControlDialog({
	open,
	setOpen
}: {
	open: boolean
	setOpen: Dispatch<SetStateAction<boolean>>
}) {
	return <SuperModal title="Настройки насоса" open={open} setOpen={setOpen} content={<Form />} />
}
