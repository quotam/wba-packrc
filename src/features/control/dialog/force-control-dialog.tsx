import { Dispatch, SetStateAction, useEffect, useState } from 'react'

import { useDevice } from '@front/entities/bluetooth-device/context'
import { SENSOR_CONFIG } from '@front/entities/bluetooth-device/validation'
import { Button } from '@front/shared/ui/button'
import { Checkbox } from '@front/shared/ui/checkbox'
import { Input } from '@front/shared/ui/input'
import { Label } from '@front/shared/ui/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@front/shared/ui/select'
import { Slider } from '@front/shared/ui/slider'
import { SuperModal } from '@front/shared/ui/superModal'

const Form = ({ close }: { close: () => void }) => {
	const [forceControlEnabled, setForceControlEnabled] = useState(false)
	const [forceSensorNo, setForceSensorNo] = useState(0)
	const [forceBound, setForceBound] = useState('100.00')

	const [targetVoltage, setTargetVoltage] = useState(0)

	const { isConnected, sendCommand, receivedData: data } = useDevice()

	const applyForceControl = async () => {
		if (!isConnected) return
		const tempValue = Math.round(Number.parseFloat(forceBound) * 16)
		const tempHex = tempValue.toString(16).toUpperCase().padStart(4, '0')
		const command = `Y${forceControlEnabled ? '1' : '0'}${forceControlEnabled ? forceSensorNo : ''}${forceControlEnabled ? tempHex : ''}\r`

		await sendCommand(command)
		if (targetVoltage > 0 && targetVoltage !== data?.TargetV) {
			await sendCommand(`T${targetVoltage.toString(16).padStart(4, '0')}\r`)
		}

		close()
	}

	const handleForceBoundChange = (value: string) => {
		const filtered = value.replace(/[^\d.-]/g, '')

		if (filtered.length <= 6) {
			setForceBound(filtered)
		}
	}

	useEffect(() => {
		if (data) {
			if (data.HeatControlStatus !== undefined) {
				setForceControlEnabled(data.HeatControlStatus === 1)
			}
			if (data.HeatControlSensorNo !== undefined && data.HeatControlSensorNo < 4) {
				setForceSensorNo(data.HeatControlSensorNo)
			}
			if (data.HeatControlValue !== undefined) {
				const temp = (data.HeatControlValue / 16).toFixed(2)
				setForceBound(temp)
			}
			if (data.TargetV) setTargetVoltage(data.TargetV * 10)
		}
	}, [open, isConnected]) //TODO: sinc

	return (
		<div className="space-y-5">
			<div className="flex gap-3">
				<Checkbox
					id="force-enabled"
					checked={forceControlEnabled}
					onCheckedChange={checked => setForceControlEnabled(checked as boolean)}
					disabled={!isConnected}
				/>
				<Label htmlFor="force-enabled" className="text-xs text-slate-400">
					Включить контроль разгона
				</Label>
			</div>
			<div className="flex gap-3">
				<div className="space-y-2">
					<Label htmlFor="force-sensor" className="text-xs text-slate-400">
						Датчик
					</Label>
					<Select
						value={forceSensorNo.toString()}
						onValueChange={value => setForceSensorNo(Number.parseInt(value))}
						disabled={!isConnected || !forceControlEnabled}
					>
						<SelectTrigger id="force-sensor" className="h-9">
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

				<div className="space-y-2">
					<Label htmlFor="force-bound" className="text-xs text-slate-400">
						Порог температуры (°C)
					</Label>
					<Input
						id="force-bound"
						type="text"
						value={forceBound}
						onChange={e => handleForceBoundChange(e.target.value)}
						disabled={!isConnected || !forceControlEnabled}
						className="h-9 font-mono"
						maxLength={6}
					/>
				</div>
			</div>

			<div className="space-y-2">
				<div className="flex justify-between text-sm">
					<span className="text-slate-400">Установка напряжения</span>
					<span>{(targetVoltage / 10).toFixed(1)} В</span>
				</div>
				<Slider
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
