'use client'

import { useState } from 'react'

import { useDevice } from '@front/entities/bluetooth-device/context'
import { Button } from '@front/shared/ui/button'
import { Power, Zap } from 'lucide-react'

import { ForceControlDialog } from './dialog/force-control-dialog'
import HeatStatus from './ui/heat-status'

export function StabilizerControl() {
	const { receivedData: data, sendCommand, isConnected } = useDevice()
	const [dialogOpen, setDialogOpen] = useState(false)

	const onModeChange = (mode: number) => sendCommand(`U${mode}\r`)
	// const { settings } = useAppSettings()

	const stabMode = data?.StabModeNo ?? 2
	const currentVoltage = data?.MeasuredV ?? 0
	const targetV = data?.TargetV ?? 0

	// const calculatePower = (): number => {
	// 	if (stabMode !== 0 || !currentVoltage) return 0
	//
	// 	const nominalPower = Number.parseInt(settings.nominalPower) || 2000
	// 	const nominalVoltage = Number.parseInt(settings.nominalVoltage) || 230
	//
	// 	const power = Math.round(Math.pow(currentVoltage / nominalVoltage, 2) * nominalPower)
	// 	return power
	// }

	const getModeLabel = () => {
		switch (stabMode) {
			case 0:
				return 'Нормальный режим'
			case 1:
				return 'Разгон'
			case 2:
				return 'Выключен'
			case 3:
				return 'Авария'
			default:
				return 'Неизвестно'
		}
	}

	const getModeColor = () => {
		switch (stabMode) {
			case 0:
				return 'text-green-400'
			case 1:
				return 'text-yellow-400'
			case 2:
				return 'text-slate-400'
			case 3:
				return 'text-red-400'
			default:
				return 'text-slate-400'
		}
	}

	return (
		<section className="space-y-6 sm:space-y-3 border px-2 py-6 rounded-lg">
			<div className="flex p-3 pb-0 items-center gap-2 font-medium">
				<Zap className="w-5 h-5" />
				Стабилизатор напряжения
			</div>
			<div className="text-center">
				<div className="text-sm text-slate-400 mb-1">Режим работы</div>
				<div className={`text-2xl font-bold ${getModeColor()}`}>{getModeLabel()}</div>
			</div>

			{/* Voltage Display */}
			<Button
				className="h-auto w-full flex-wrap px-0"
				onClick={() => setDialogOpen(true)}
				variant="ghost"
				disabled={!isConnected}
			>
				<div className="grid grid-cols-2 gap-4">
					<div className="text-center p-4 rounded-lg">
						<div className="text-sm text-slate-400 mb-1">Целевое</div>
						<div className="text-3xl font-bold text-blue-400 font-mono">
							{targetV.toFixed(1)}
							<span className="text-lg ml-1">В</span>
						</div>
					</div>
					<div className="text-center p-4 rounded-lg">
						<div className="text-sm text-slate-400 mb-1">Текущее</div>
						<div className="text-3xl font-bold text-cyan-400 font-mono">
							{currentVoltage.toFixed(1)}
							<span className="text-lg ml-1">В</span>
						</div>
					</div>
				</div>
				<HeatStatus data={data} />
			</Button>

			{/* Mode Buttons */}
			<div className="flex flex-wrap gap-2 items-center justify-center px-2">
				<Button
					variant={stabMode === 2 ? 'default' : 'outline'}
					onClick={() => onModeChange(2)}
					disabled={!isConnected}
					className="gap-2"
				>
					Стоп
				</Button>

				<Button
					variant={stabMode === 0 ? 'default' : 'outline'}
					onClick={() => onModeChange(0)}
					disabled={!isConnected}
					className="gap-2"
				>
					<Power className="w-4 h-4" />
					Норма
				</Button>

				<Button
					variant={stabMode === 1 ? 'default' : 'outline'}
					onClick={() => onModeChange(1)}
					disabled={!isConnected}
					className="gap-2"
				>
					<Zap className="w-4 h-4" />
					Разгон
				</Button>
			</div>

			<ForceControlDialog open={dialogOpen} setOpen={setDialogOpen} />
		</section>
	)
}
