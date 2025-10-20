'use client'

import { BluetoothProvider } from '@front/entities/bluetooth-device/context'
import ThemeProvider from '@front/kernel/lib/next-theme/themeProvider'

const AppProvider = ({ children }: { children: React.ReactNode }) => {
	return (
		<ThemeProvider>
			<BluetoothProvider>{children}</BluetoothProvider>
		</ThemeProvider>
	)
}

export default AppProvider
