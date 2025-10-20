import { memo } from 'react'

import {
	formatPressure,
	formatTemperature,
	isValidPressure,
	isValidTemperature
} from '@front/entities/bluetooth-device/validation'
import { cn } from '@front/shared/lib/utils'
import { AlertTriangle } from 'lucide-react'

interface SensorPanelProps {
	label: string
	value?: number
	bound?: number
	color: string
	unit: string
	isPressure?: boolean
	isActive?: boolean
	onClick?: () => void
}

export const SensorPanel = memo(
	({
		label,
		value,
		isPressure = false,
		bound,
		onClick,
		color,
		unit,
		isActive
	}: SensorPanelProps) => {
		const isValid = isPressure ? isValidPressure(value) : isValidTemperature(value)
		const displayValue = isPressure ? formatPressure(value) : formatTemperature(value)
		const displayBound = isValidTemperature(bound) ? bound!.toFixed(2) : ''

		return (
			<div
				onClick={onClick}
				className={cn(
					'rounded-lg bg-background flex flex-col gpa-2 sm:flex-row flex-wrap border p-4 sm:p-2 xs:p-1 cursor-pointer',
					isActive && 'ring-2 ring-red-500'
					// !isValid && 'sm:hidden'
				)}
			>
				<div className="flex items-center text-lg sm:text-base justify-between">
					<span className="text-sm sm:text-xs text-slate-400">{label}</span>
					{isActive && <AlertTriangle className="w-4 h-4 text-red-500 animate-pulse" />}
				</div>

				<div
					style={{ color: isValid ? color : 'gray' }}
					className={`text-heading sm:text-lg xs:text-base font-bold font-mono`}
				>
					{displayValue}
					<span className="text-xl sm:text-base ml-1">{unit}</span>
				</div>

				{displayBound && (
					<div
						className={`text-lg sm:text-base ${isActive ? 'bg-red-500 text-white' : 'bg-slate-700 text-slate-300'} px-2 py-1 rounded`}
					>
						Порог: {displayBound}
						{unit}
					</div>
				)}
			</div>
		)
	}
)

SensorPanel.displayName = 'SensorPanel'
