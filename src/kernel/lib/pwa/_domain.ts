export interface BeforeInstallPromptEvent extends Event {
	readonly platforms: string[]
	readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
	prompt(): Promise<void>
}

declare global {
	interface WindowEventMap {
		beforeinstallprompt: BeforeInstallPromptEvent
		appinstalled: Event
	}
}

export interface PwaInstallProps {
	isSupported: boolean
	deferredPrompt: BeforeInstallPromptEvent | null
	onInstall: () => void
}
