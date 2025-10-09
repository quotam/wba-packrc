'use client'

import { BluetoothProvider } from '@front/entities/bluetooth-device/context'
import ThemeProvider from '@front/kernel/lib/next-theme/themeProvider'

import QueriesClient from './queryClient'

const AppProvider = ({ children }: { children: React.ReactNode }) => {
	return (
		<ThemeProvider>
			<QueriesClient>
				<BluetoothProvider>{children}</BluetoothProvider>
			</QueriesClient>
		</ThemeProvider>
	)
}

export default AppProvider
