'use client'

import type React from 'react'
import { useEffect, useRef, useState } from 'react'

import { Button } from '@front/shared/ui/button'
import { Card, CardContent } from '@front/shared/ui/card'
import { Checkbox } from '@front/shared/ui/checkbox'
import { Input } from '@front/shared/ui/input'
import { Label } from '@front/shared/ui/label'
import { SuperModal } from '@front/shared/ui/superModal'
import { Copy, Minus, Plus } from 'lucide-react'

interface SensorConfigDialogProps {
	open: boolean
	onOpenChange: React.Dispatch<React.SetStateAction<boolean>>
	sensorIndex: number
	sensorName: string
	currentValue?: number
	currentBound?: number
	currentReaction?: number
	onSave: (sensorIndex: number, bound: number, reaction: number) => void
}

export function SensorConfigDialog({
	open,
	onOpenChange,
	sensorIndex,
	sensorName,
	currentValue,
	currentBound,
	currentReaction = 0,
	onSave
}: SensorConfigDialogProps) {
	const [margin, setMargin] = useState('')
	const [reactionOn, setReactionOn] = useState(false)
	const [sound, setSound] = useState(false)
	const [pumpStop, setPumpStop] = useState(false)
	const [heaterOff, setHeaterOff] = useState(false)
	const inputRef = useRef<HTMLInputElement>(null)

	useEffect(() => {
		if (open) {
			setMargin(
				currentBound !== undefined && currentBound >= -55 && currentBound <= 127
					? currentBound.toFixed(2)
					: ''
			)
			setSound(Boolean((currentReaction >> 0) & 1))
			setPumpStop(Boolean((currentReaction >> 1) & 1))
			setHeaterOff(Boolean((currentReaction >> 2) & 1))
			setReactionOn(Boolean((currentReaction >> 3) & 1))

			setTimeout(() => {
				inputRef.current?.select()
			}, 100)
		}
	}, [open])

	const handleCopyTemp = () => {
		if (currentValue !== undefined && currentValue >= -55 && currentValue <= 127) {
			const newValue = currentValue + 0.125
			const formatted = Math.max(-55, Math.min(127, newValue)).toFixed(2)
			setMargin(formatted)
		}
	}

	const handleIncrement = () => {
		const currentBound = Number(margin)
		if (currentBound !== undefined && currentBound >= -55 && currentBound <= 127) {
			const newValue = currentBound + 0.0065
			const formatted = Math.max(-55, Math.min(127, newValue)).toFixed(2)
			setMargin(formatted)
		}
	}

	const handleDecrement = () => {
		const currentBound = Number(margin)
		if (margin !== undefined && currentBound >= -55 && currentBound <= 127) {
			const newValue = currentBound - 0.0065
			const formatted = Math.max(-55, Math.min(127, newValue)).toFixed(2)
			setMargin(formatted)
		}
	}

	const handleSave = () => {
		const marginFloat = Number.parseFloat(margin)
		if (isNaN(marginFloat) || marginFloat < -55 || marginFloat > 127) return

		const reactionCode =
			(reactionOn ? 8 : 0) | (heaterOff ? 4 : 0) | (pumpStop ? 2 : 0) | (sound ? 1 : 0)
		onSave(sensorIndex, marginFloat, reactionCode)
		onOpenChange(false)
	}

	return (
		<SuperModal
			open={open}
			setOpen={onOpenChange}
			title={`Настройка датчика ${sensorName}`}
			content={
				<div className="space-y-4">
					{/* Current Temperature Display */}
					<Card>
						<CardContent className="pt-4">
							<div className="text-center">
								<div className="text-sm text-slate-400 mb-1">Текущая температура</div>
								<div className="text-3xl font-bold text-blue-400 font-mono">
									{currentValue !== undefined && currentValue >= -55 && currentValue <= 127
										? currentValue.toFixed(2)
										: '----'}
									<span className="text-lg ml-1">°C</span>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Margin Input with Controls */}
					<div className="space-y-2">
						<Label>Порог срабатывания (°C)</Label>
						<div className="flex gap-2">
							<Button
								type="button"
								variant="secondary"
								size="icon"
								onClick={handleCopyTemp}
								className="shrink-0"
								title="Копировать текущую температуру + 0.125°C"
							>
								<Copy className="w-4 h-4" />
							</Button>
							<Input
								ref={inputRef}
								value={margin}
								onChange={e => setMargin(e.target.value)}
								className="font-mono text-lg"
								placeholder="-55.00 ... 127.00"
							/>
							<Button
								type="button"
								variant="secondary"
								size="icon"
								onClick={handleDecrement}
								className="shrink-0"
							>
								<Minus className="w-4 h-4" />
							</Button>
							<Button
								type="button"
								variant="secondary"
								size="icon"
								onClick={handleIncrement}
								className="shrink-0"
							>
								<Plus className="w-4 h-4" />
							</Button>
						</div>
						<p className="text-xs text-slate-400">Диапазон: -55.00 до 127.00°C</p>
					</div>

					{/* Reaction Settings */}
					<Card>
						<CardContent className="pt-4 space-y-3">
							<div className="flex items-center space-x-2">
								<Checkbox
									id="reaction-on"
									checked={reactionOn}
									onCheckedChange={checked => setReactionOn(checked as boolean)}
								/>
								<Label htmlFor="reaction-on" className="font-semibold cursor-pointer">
									Включить реакцию на превышение порога
								</Label>
							</div>

							<div className="pl-6 space-y-2 border-l-2 border-slate-700">
								<div className="flex items-center space-x-2">
									<Checkbox
										id="sound"
										checked={sound}
										onCheckedChange={checked => setSound(checked as boolean)}
										disabled={!reactionOn}
									/>
									<Label htmlFor="sound" className={`cursor-pointer ${!reactionOn ? 'text-slate-500' : ''}`}>
										Звуковое оповещение
									</Label>
								</div>

								<div className="flex items-center space-x-2">
									<Checkbox
										id="pump-stop"
										checked={pumpStop}
										onCheckedChange={checked => setPumpStop(checked as boolean)}
										disabled={!reactionOn}
									/>
									<Label
										htmlFor="pump-stop"
										className={`cursor-pointer ${!reactionOn ? 'text-slate-500' : ''}`}
									>
										Остановить насос
									</Label>
								</div>

								<div className="flex items-center space-x-2">
									<Checkbox
										id="heater-off"
										checked={heaterOff}
										onCheckedChange={checked => setHeaterOff(checked as boolean)}
										disabled={!reactionOn}
									/>
									<Label
										htmlFor="heater-off"
										className={`cursor-pointer ${!reactionOn ? 'text-slate-500' : ''}`}
									>
										Выключить нагреватель
									</Label>
								</div>
							</div>
						</CardContent>
					</Card>

					<Button className="w-full" onClick={handleSave}>
						Сохранить настройки
					</Button>
				</div>
			}
		/>
	)
}
