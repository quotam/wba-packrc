'use client'

import { ReactNode } from 'react'

import { useMediaQuery } from '@front/kernel/hooks/useMediaQuery'
import { cn } from '@front/shared/lib/utils'
import { Button } from '@front/shared/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@front/shared/ui/dialog'
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger
} from '@front/shared/ui/drawer'

type Props = {
	open?: boolean
	setOpen?: React.Dispatch<React.SetStateAction<boolean>>
	content?: ReactNode
	closeButt?: boolean
	title?: ReactNode
	trigger?: ReactNode
	mediaQuery?: string
	DesktopNode?: ReactNode
	mobileNode?: ReactNode
	style?: {
		dialog?: string
		drawer?: string
		drawerTrigger?: string
	}
	defaultValue?: boolean
	initializeWithValue?: boolean
}

const SuperModal = ({
	open,
	setOpen,
	content,
	closeButt = false,
	title,
	trigger,
	DesktopNode: customDesktopNode,
	mobileNode: customMobileNode,
	defaultValue = false,
	initializeWithValue = true,
	mediaQuery = '(min-width: 768px)',
	style
}: Props) => {
	const isDesktop = useMediaQuery(mediaQuery, {
		defaultValue,
		initializeWithValue
	})

	if (isDesktop) {
		if (customDesktopNode) return customDesktopNode

		return (
			<Dialog open={open} onOpenChange={setOpen}>
				{trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
				<DialogContent className={cn('sm:max-w-[42rem] min-w-100 rounded-lg', style?.dialog)}>
					<DialogHeader>
						<DialogTitle>{title}</DialogTitle>
						<DialogDescription className="sr-only">dialog</DialogDescription>
					</DialogHeader>
					{content}
				</DialogContent>
			</Dialog>
		)
	}

	if (customMobileNode) return customMobileNode

	return (
		<Drawer open={open} onOpenChange={setOpen}>
			{trigger && (
				<DrawerTrigger asChild className={style?.drawerTrigger}>
					{trigger}
				</DrawerTrigger>
			)}
			<DrawerContent className={cn('p-4', style?.drawer)}>
				<DrawerHeader className="text-left">
					<DrawerTitle>{title}</DrawerTitle>
					<DrawerDescription className="sr-only">drawer</DrawerDescription>
				</DrawerHeader>
				{content}
				{closeButt && (
					<DrawerFooter className="pt-2">
						<DrawerClose asChild>
							<Button aria-label="Close" aria-labelledby="Закрыть" name="close" variant="outline">
								Закрыть
							</Button>
						</DrawerClose>
					</DrawerFooter>
				)}
			</DrawerContent>
		</Drawer>
	)
}

SuperModal.displayName = 'SuperModal'

export { SuperModal }
