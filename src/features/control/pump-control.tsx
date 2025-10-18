'use client'

import { useState } from 'react'

import { useDevice } from '@front/entities/bluetooth-device/context'
import { Button } from '@front/shared/ui/button'
import { Droplets, Play, Square } from 'lucide-react'

import { PumpControlDialog } from './dialog/pump-control-dialog'

export function PumpControl() {
	const { isConnected, commandClient, receivedData: data } = useDevice()

	const [dialogOpen, setDialogOpen] = useState(false)

	const onStart = () => commandClient.startPump(),
		onReset = () => commandClient.resetTotalCounter()

	const rate = data?.Rate ?? 0
	const total = data?.Total ?? 0
	const remain = data?.Remain ?? 0
	const dose = data?.Dose ?? 0
	const remainTime = data?.RemainT ?? 0
	const isRunning = data?.AFlagsStatus === 1

	const formatTime = (seconds: number) => {
		const h = Math.floor(seconds / 3600)
		const m = Math.floor((seconds % 3600) / 60)
		const s = seconds % 60
		return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
	}

	return (
		<section className="space-y-6 sm:space-y-3 border px-2 py-6 rounded-lg">
			<div className="flex p-3 pb-0 items-center gap-2 font-medium">
				<Droplets className="w-5 h-5" />
				Управление насосом
			</div>
			<Button
				className="h-auto w-full flex-wrap px-0 grid grid-cols-3 gap-4"
				onClick={() => setDialogOpen(true)}
				variant="ghost"
				disabled={!isConnected}
			>
				<div className="text-center p-2  rounded-lg">
					<div className="text-sm text-slate-400 mb-1">Темп</div>
					<div className="text-3xl font-bold text-green-400 font-mono">
						{rate >= 0 ? rate : '---'}
						<span className="text-lg ml-1">мл/ч</span>
					</div>
				</div>

				<div className="text-center p-2 rounded-lg">
					<div className="text-sm text-slate-400 mb-1">Итого</div>
					<div className="text-3xl font-bold text-blue-400 font-mono">
						{total >= 0 ? total : '---'}
						<span className="text-lg ml-1">мл</span>
					</div>
				</div>

				<div className="text-center p-2  rounded-lg">
					<div className="text-sm text-slate-400 mb-1">Остаток</div>
					<div className="text-3xl font-bold text-purple-400 font-mono">
						{remain >= 0 ? remain : '---'}
						<span className="text-lg ml-1">мл</span>
					</div>
				</div>
			</Button>

			{/* Auto-stop info */}
			<div className="text-center p-3 rounded-lg">
				<div className="text-sm text-slate-400">
					{dose === 0 ? 'Автостоп выключен' : `Автостоп: ${dose} мл`}
				</div>
				{remainTime > 0 && (
					<div className="text-lg font-mono text-purple-400 mt-1">
						Осталось: {formatTime(remainTime)}
					</div>
				)}
			</div>

			{/* Control Buttons */}
			<div className="grid grid-cols-2 gap-2 px-2">
				<Button
					variant={isRunning ? 'outline' : 'default'}
					onClick={onStart}
					disabled={!isConnected}
					className="gap-2"
					size="lg"
				>
					{isRunning ? <Square className="w-5 h-5" /> : <Play className="w-5 h-5" />}
					{isRunning ? 'Стоп' : 'Старт'}
				</Button>

				<Button variant="outline" onClick={onReset} disabled={!isConnected} size="lg">
					Сброс
				</Button>
			</div>
			<PumpControlDialog open={dialogOpen} setOpen={setDialogOpen} />
		</section>
	)
}
