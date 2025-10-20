import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'

import { useDevice } from '@front/entities/bluetooth-device/context'
import { SENSOR_CONFIG } from '@front/entities/bluetooth-device/validation'
import { Button } from '@front/shared/ui/button'
import { Label } from '@front/shared/ui/label'
import { MarginInputWithControls } from '@front/shared/ui/marginInput'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@front/shared/ui/select'
import { Separator } from '@front/shared/ui/separator'
import { Slider } from '@front/shared/ui/slider'
import { SuperModal } from '@front/shared/ui/superModal'
import { Switch } from '@front/shared/ui/switch'

const Form = ({ close }: { close: () => void }) => {
	const [forceControlEnabled, setForceControlEnabled] = useState(false)
	const [forceSensorNo, setForceSensorNo] = useState(0)
	const [forceBound, setForceBound] = useState(100.0)

	const [targetVoltage, setTargetVoltage] = useState(0)

	const { isConnected, commandClient, receivedData: data } = useDevice()
	const inputRef = useRef<HTMLInputElement>(null)

	const applyForceControl = async () => {
		if (!isConnected) return
		await commandClient.toggleForceControl(forceBound, forceControlEnabled, forceSensorNo)

		if (targetVoltage > 0 && targetVoltage !== data?.TargetV) {
			await commandClient.setTargetVoltage(targetVoltage)
		}

		close()
	}

	const handleForceBoundChange = (value: string) => {
		const filtered = value.replace(/[^\d.-]/g, '')
		const numValue = parseFloat(filtered)

		if (!isNaN(numValue) && filtered.length <= 6) {
			setForceBound(numValue)
		}
	}

	const formatForceBound = (value: number): string => {
		return value.toFixed(2)
	}

	const handleCopyTemp = () => {
		const currentValue = data?.SensorValue[forceSensorNo]
		if (!currentValue) return

		const newValue = currentValue + 0.125
		const formatted = Math.max(-55, Math.min(127, newValue)).toFixed(2)
		setForceBound(parseFloat(formatted))
	}

	const handleIncrement = () => {
		const newValue = forceBound + 0.01
		const formatted = Math.max(-55, Math.min(127, newValue))
		setForceBound(Number(formatted.toFixed(2)))
	}

	const handleDecrement = () => {
		const newValue = forceBound - 0.01
		const formatted = Math.max(-55, Math.min(127, newValue))
		setForceBound(Number(formatted.toFixed(2)))
	}

	// Функции для изменения напряжения
	const adjustVoltage = (increment: number) => {
		setTargetVoltage(prev => {
			const newValue = prev + increment
			return Math.max(0, Math.min(2500, newValue))
		})
	}

	useEffect(() => {
		if (data) {
			if (data.HeatControlStatus !== undefined) {
				setForceControlEnabled(data.HeatControlStatus === 1 ? true : false)
			}
			if (data.HeatControlSensorNo !== undefined && data.HeatControlSensorNo < 4) {
				setForceSensorNo(data.HeatControlSensorNo)
			}
			if (data.HeatControlValue !== undefined) {
				setForceBound(data.HeatControlValue)
			}
			if (data.TargetV) setTargetVoltage(data.TargetV * 10)
		}
	}, [open, isConnected])

	return (
		<div className="space-y-5">
			<div className="flex items-center gap-3">
				<Switch
					id="force-enabled"
					checked={forceControlEnabled}
					disabled={!isConnected}
					onCheckedChange={checked => setForceControlEnabled(checked as boolean)}
				/>
				<Label htmlFor="force-enabled">Контроль разгона</Label>
			</div>

			<div className="flex gap-5 ">
				<div className="space-y-2 flex-1">
					<Label htmlFor="force-sensor">Датчик</Label>
					<Select
						value={forceSensorNo.toString()}
						onValueChange={value => setForceSensorNo(Number.parseInt(value))}
						disabled={!isConnected || !forceControlEnabled}
					>
						<SelectTrigger id="force-sensor" className="h-9 w-full">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{Object.values(SENSOR_CONFIG).map((key, i) => (
								<SelectItem key={i} value={i.toString()}>
									{key.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<MarginInputWithControls
					value={formatForceBound(forceBound)}
					onChange={handleForceBoundChange}
					onCopy={handleCopyTemp}
					onIncrement={handleIncrement}
					onDecrement={handleDecrement}
					inputRef={inputRef}
					placeholder="100.00"
					min={-55}
					max={127}
					disabled={!isConnected || !forceControlEnabled}
				/>
			</div>

			<Separator />
			<div className="space-y-2">
				<Label htmlFor="target-v">Задать напряжение</Label>

				{/* Обновленный блок отображения напряжения с кнопками по бокам */}
				<div className="flex items-center justify-center bg-secondary rounded-b-lg">
					{/* Кнопки уменьшения слева */}
					<div className="flex gap-1">
						<Button
							variant="outline"
							size="sm"
							onClick={() => adjustVoltage(-10)}
							disabled={!isConnected}
							className="h-8 w-12"
						>
							-1
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={() => adjustVoltage(-50)}
							disabled={!isConnected}
							className="h-8 w-12"
						>
							-5
						</Button>
					</div>

					{/* Отображение напряжения по центру */}
					<div className=" w-40 text-center p-2 rounded-lg">
						<div className="text-sm text-slate-400 mb-1">Целевое напряжение В</div>
						<div className="text-3xl font-bold text-blue-400 font-mono">
							{(targetVoltage / 10).toFixed(1)}
						</div>
					</div>

					{/* Кнопки увеличения справа */}
					<div className="flex gap-1">
						<Button
							variant="outline"
							size="sm"
							onClick={() => adjustVoltage(50)}
							disabled={!isConnected}
							className="h-8 w-12"
						>
							+5
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={() => adjustVoltage(10)}
							disabled={!isConnected}
							className="h-8 w-12"
						>
							+1
						</Button>
					</div>
				</div>

				<Slider
					id="target-v"
					value={[targetVoltage]}
					onValueChange={v => setTargetVoltage(v[0])}
					min={0}
					max={2500}
					step={10}
					disabled={!isConnected}
					className="w-full"
				/>
			</div>

			<Button onClick={applyForceControl} disabled={!isConnected} className="w-full h-9" size="sm">
				Применить
			</Button>
		</div>
	)
}

export function ForceControlDialog({
	open,
	setOpen
}: {
	open: boolean
	setOpen: Dispatch<SetStateAction<boolean>>
}) {
	return (
		<SuperModal
			title="Контроль напряжения"
			open={open}
			setOpen={setOpen}
			content={<Form close={() => setOpen(false)} />}
		/>
	)
}
