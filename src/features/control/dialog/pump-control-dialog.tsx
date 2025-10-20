import { Dispatch, SetStateAction, useEffect, useState } from 'react'

import { useDevice } from '@front/entities/bluetooth-device/context'
import { Button } from '@front/shared/ui/button'
import { Input } from '@front/shared/ui/input'
import { Label } from '@front/shared/ui/label'
import { Separator } from '@front/shared/ui/separator'
import { SuperModal } from '@front/shared/ui/superModal'

const Form = () => {
	const { commandClient, isConnected, receivedData: data, connectionStatus } = useDevice()

	const [newStepsFor100, setNewStepsFor100] = useState('')
	const [rateInput, setRateInput] = useState('')
	const [doseInput, setDoseInput] = useState('')

	useEffect(() => {
		if (!isConnected) return
		commandClient.sendZ0()
	}, [isConnected, commandClient, connectionStatus])

	const rate = data?.Rate ?? 0
	const dose = data?.Dose ?? 0
	const stepsFor100 = data?.stepsFor100 ?? 0

	const handleSetSubmit = () => {
		const value = Number.parseInt(newStepsFor100)
		if (!isNaN(value)) {
			commandClient.pumpCalibrate(value)
		}
	}

	const handleRateSubmit = () => {
		const value = Number.parseInt(rateInput)
		if (!isNaN(value) && value >= 0 && value <= 3600) {
			commandClient.setPumpRate(value)
		}
	}

	const handleDoseSubmit = () => {
		const value = Number.parseInt(doseInput)
		if (!isNaN(value)) {
			commandClient.setDose(value)
		}
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

			<Separator />
			<div className="space-y-2">
				<Label htmlFor="new-steps">Количество шагов на 100:</Label>

				<div className="flex gap-2">
					<Input
						id="new-steps"
						type="number"
						min={0}
						max={9999999}
						placeholder={stepsFor100.toString()}
						value={newStepsFor100}
						onChange={e => setNewStepsFor100(e.target.value)}
						disabled={!isConnected}
						aria-label="Установить новое количество шагов на 100 единиц"
					/>
					<Button onClick={handleSetSubmit} disabled={!isConnected}>
						Установить
					</Button>
				</div>
			</div>
			<div className="text-center bg-secondary p-2 rounded-b-lg">
				<div className="text-sm text-slate-400 mb-1">Текущие количество шагов на 100</div>
				<div className="text-3xl font-bold text-blue-400 font-mono">{stepsFor100}</div>
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
