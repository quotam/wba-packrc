'use client'

import { Button } from '@front/shared/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@front/shared/ui/dropdown-menu'
import { MoonIcon, SunIcon } from 'lucide-react'

import { useThemeHandle } from './selectTheme'

export default function ThemeSwither() {
	const { selectHandle } = useThemeHandle()

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					className="size-8"
					variant="ghost"
					aria-label="Change theme"
					aria-labelledby="Change theme"
					size="icon"
				>
					<SunIcon
						strokeWidth={2}
						className="min-h-4 min-w-4 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0"
					/>
					<MoonIcon
						strokeWidth={2}
						className="absolute min-h-4 min-w-4 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100"
					/>
					<span className="sr-only">Change theme</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem onClick={() => selectHandle('light')}>Светлая</DropdownMenuItem>
				<DropdownMenuItem onClick={() => selectHandle('dark')}>Темная</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={() => selectHandle('system')}>Системная</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
