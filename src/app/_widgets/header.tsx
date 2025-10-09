import React from 'react'

import Link from 'next/link'

import DesktopButton from '@front/kernel/lib/pwa/desktopButton'
import { MobilePwaButton } from '@front/kernel/lib/pwa/mobileButton'
import { PwaProvider } from '@front/kernel/lib/pwa/provider'
import { NAVIGATION } from '@front/shared/config/publicConfig'
import { Button } from '@front/shared/ui/button'
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger
} from '@front/shared/ui/sheet'
import { Menu } from 'lucide-react'

export function Header({
	logo,
	profile,
	actions
}: {
	logo?: React.ReactNode
	profile?: React.ReactNode
	actions?: React.ReactNode
}) {
	return (
		<header className="sticky top-0 z-50 w-full border-b  md:border-none bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container flex h-14 items-center">
				<div className="flex mr-10 md:hidden">{logo}</div>
				<PwaProvider>
					<Sheet>
						<SheetTrigger asChild>
							<Button
								aria-label="Меню"
								aria-labelledby="Меню"
								className="hidden size-9 md:flex hover:bg-transparent text-foreground/75 hover:text-foreground border border-foreground/10"
								variant="ghost"
								size="icon"
							>
								<Menu className="size-5" />
								<span className="sr-only">Меню</span>
							</Button>
						</SheetTrigger>
						<SheetContent className="flex flex-col justify-between" side="left">
							<div>
								<SheetHeader className="border-b items-start pb-5 mb-5">
									<SheetTitle>
										<SheetClose asChild>{logo}</SheetClose>{' '}
									</SheetTitle>
									<SheetDescription className="sr-only">menu</SheetDescription>
								</SheetHeader>
								<ul className="flex flex-col space-y-4 px-3">
									{NAVIGATION.header.map(item => (
										<li key={item.href}>
											<SheetClose asChild>
												<Button variant="secondary" className="w-full" asChild>
													<Link href={item.href}>{item.title}</Link>
												</Button>
											</SheetClose>
										</li>
									))}
								</ul>
							</div>
							<MobilePwaButton />
						</SheetContent>
					</Sheet>
					<div className="items-center flex-1 flex">
						<nav className="md:hidden">
							<ul className="flex uppercase font-bold space-x-6">
								{NAVIGATION.header.map(item => (
									<li key={item.href}>
										<Link
											className="link font-bold"
											target={item.href.includes('http') ? '_blank' : undefined}
											href={item.href}
										>
											{item.title}
										</Link>
									</li>
								))}
							</ul>
						</nav>

						<div className="flex flex-1 items-center justify-end space-x-3">
							<DesktopButton className="md:hidden text-muted-foreground" />
							{actions}
							{profile && <div className="h-4 w-px bg-muted-foreground" aria-hidden />}
							{profile}
						</div>
					</div>
				</PwaProvider>
			</div>
		</header>
	)
}
