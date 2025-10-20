'use client'

import { RefObject } from 'react'

import { Button } from '@front/shared/ui/button'
import { Input } from '@front/shared/ui/input'
import { Label } from '@front/shared/ui/label'
import { Copy, Minus, Plus } from 'lucide-react'

interface MarginInputWithControlsProps {
	value: string
	onChange: (value: string) => void
	onCopy: () => void
	onIncrement: () => void
	onDecrement: () => void
	inputRef: RefObject<HTMLInputElement | null>
	placeholder?: string
	min?: number
	max?: number
	disabled?: boolean
}

export function MarginInputWithControls({
	value,
	onChange,
	onCopy,
	onIncrement,
	onDecrement,
	inputRef,
	placeholder = '-55.00 ... 127.00',
	min = -55,
	max = 127,
	disabled
}: MarginInputWithControlsProps) {
	return (
		<div className="space-y-2">
			<Label>Порог срабатывания (°C)</Label>
			<div className="flex gap-2">
				<Button
					type="button"
					variant="secondary"
					size="icon"
					onClick={onCopy}
					disabled={disabled}
					className="shrink-0"
					title="Копировать текущую температуру + 0.125°C"
				>
					<Copy className="w-4 h-4" />
				</Button>
				<Input
					ref={inputRef}
					type="number"
					value={value}
					onChange={e => onChange(e.target.value)}
					className="font-mono text-lg"
					placeholder={placeholder}
					step="0.01"
					disabled={disabled}
					min={min}
					max={max}
				/>
				<Button
					type="button"
					variant="secondary"
					size="icon"
					disabled={disabled}
					onClick={onDecrement}
					className="shrink-0"
				>
					<Minus className="w-4 h-4" />
				</Button>
				<Button
					type="button"
					disabled={disabled}
					variant="secondary"
					size="icon"
					onClick={onIncrement}
					className="shrink-0"
				>
					<Plus className="w-4 h-4" />
				</Button>
			</div>
			<p className="text-xs text-slate-400">
				Диапазон: {min.toFixed(2)} до {max.toFixed(2)}°C
			</p>
		</div>
	)
}
