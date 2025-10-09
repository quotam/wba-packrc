'use client'

import { useContext } from 'react'

import { cn } from '@front/shared/lib/utils'
import { Button } from '@front/shared/ui/button'
import { MonitorDown } from 'lucide-react'

import { PwaContext } from './context'

const DesktopButton = ({ className }: { className?: string }) => {
	const { onInstall, isSupported } = useContext(PwaContext)

	if (!isSupported) return null

	return (
		<Button
			onClick={onInstall}
			className={cn(
				'rounded-lg size-9 transition-all duration-300 ease-out',
				'animate-in fade-in-0 slide-in-from-bottom-2',
				'hover:scale-105 active:scale-95',
				className
			)}
			aria-label="Установить приложение"
			aria-labelledby="Установить приложение"
			title="Установить приложение"
			variant="ghost"
		>
			<MonitorDown className="size-5 transition-transform duration-200" />
			<span className="sr-only">install pwa application</span>
		</Button>
	)
}

export default DesktopButton
