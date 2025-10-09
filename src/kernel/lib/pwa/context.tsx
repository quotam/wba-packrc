import { createContext } from 'react'

import { PwaInstallProps } from './_domain'

export const PwaContext = createContext<PwaInstallProps>({
	isSupported: false,
	deferredPrompt: null,
	onInstall: () => {}
})
