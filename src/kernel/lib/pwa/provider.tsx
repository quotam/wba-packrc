'use client'

import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react'

import { BeforeInstallPromptEvent } from './_domain'
import { PwaContext } from './context'

export const PwaProvider = ({ children }: { children: ReactNode }) => {
	const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
	const [isSupported, setIsSupported] = useState(false)

	useEffect(() => {
		const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
			e.preventDefault()
			setDeferredPrompt(e)
			setIsSupported(true)
		}

		const handleAppInstalled = () => {
			setDeferredPrompt(null)
			setIsSupported(false)
		}

		window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
		window.addEventListener('appinstalled', handleAppInstalled)

		return () => {
			window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
			window.removeEventListener('appinstalled', handleAppInstalled)
		}
	}, [])

	const onInstall = useCallback(async () => {
		if (!deferredPrompt) return

		try {
			await deferredPrompt.prompt()
			const { outcome } = await deferredPrompt.userChoice

			if (outcome === 'accepted') {
				setDeferredPrompt(null)
				setIsSupported(false)
			}
		} catch (error) {
			console.error('Install failed:', error)
		}
	}, [deferredPrompt])

	const value = useMemo(
		() => ({
			isSupported,
			deferredPrompt,
			onInstall
		}),
		[isSupported, deferredPrompt, onInstall]
	)

	return <PwaContext.Provider value={value}>{children}</PwaContext.Provider>
}
