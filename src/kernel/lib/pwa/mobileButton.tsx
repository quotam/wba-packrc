'use client'

import { useContext, useState } from 'react'

import { cn } from '@front/shared/lib/utils'
import { Button } from '@front/shared/ui/button'
import { Home, Plus, Smartphone } from 'lucide-react'

import { PwaContext } from './context'

export function MobilePwaButton({ className }: { className?: string }) {
	const [isHovered, setIsHovered] = useState(false)

	const { onInstall, isSupported } = useContext(PwaContext)

	if (!isSupported) {
		return null
	}

	return (
		<Button
			onClick={onInstall}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			className={cn(
				'relative overflow-hidden group bg-primary hover:bg-primary/90 text-primary-foreground border border-border hover:border-primary/50 p-3 h-auto min-h-[4rem] rounded-xl m-3 transition-all duration-300 ease-out transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl touch-manipulation',
				className
			)}
		>
			<div className="flex items-center gap-3 w-full">
				<div className="relative flex-shrink-0">
					<div
						className={cn(
							'flex items-center justify-center size-9 rounded-lg bg-primary-foreground/10 group-hover:bg-primary-foreground/20 transition-all duration-300',
							isHovered ? 'rotate-6 scale-110' : ''
						)}
					>
						<div className="relative">
							<Smartphone
								className={cn(
									'size-4 transition-all duration-300',
									isHovered ? 'scale-90 opacity-20' : 'opacity-100'
								)}
							/>
							<Home
								className={cn(
									'absolute inset-0 size-4 transition-all duration-300',
									isHovered ? 'opacity-100 scale-110' : 'opacity-0 scale-75'
								)}
							/>
						</div>
					</div>

					<div
						className={cn(
							'absolute top-0 right-0 size-4 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center transition-all duration-300',
							isHovered ? 'scale-110 rotate-90' : 'scale-100'
						)}
					>
						<Plus strokeWidth={3} className="size-3" />
					</div>
				</div>

				<div className="flex flex-col text-xs items-start flex-1 min-w-0">
					<span className="font-bold leading-tight text-balance">Добавить на главный экран</span>
					<span className="opacity-80 group-hover:opacity-100 transition-opacity duration-300">
						Быстрый доступ к приложению
					</span>
				</div>
			</div>

			<div
				className={cn(
					'absolute inset-0 rounded-xl transition-opacity duration-300 bg-gradient-to-r from-transparent via-primary-foreground/5 to-transparent',
					isHovered ? 'opacity-100' : 'opacity-0'
				)}
			/>
		</Button>
	)
}
