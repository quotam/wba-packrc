import type { Metadata } from 'next'
import { Nunito } from 'next/font/google'
import Link from 'next/link'

import { StatusDisplay } from '@front/features/status/pub/status-display'
import { APP_INFO } from '@front/shared/config/publicConfig'
import { Toaster } from '@front/shared/ui/sonner'
import NextTopLoader from 'nextjs-toploader'

import AppProvider from './_providers/appProvider'
import DeviceState from './_widgets/device-state'
import Footer from './_widgets/footer'
import { Header } from './_widgets/header'
import './globals.css'

const nunito = Nunito({
	subsets: ['cyrillic'],
	variable: '--font-sans',
	display: 'swap',
	weight: ['400', '600', '700']
})

export const metadata: Metadata = {
	title: APP_INFO.name,

	appleWebApp: {
		capable: true,
		statusBarStyle: 'default',
		title: APP_INFO.name
	}
}

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="ru" suppressHydrationWarning>
			<body className={nunito.variable}>
				<NextTopLoader showSpinner={false} color="var(--primary)" />
				<AppProvider>
					<div className="min-h-screen flex gap-4 flex-col">
						<Header
							logo={
								<Link href="/">
									<h1 className="text-lg font-bold">Дистилляционный аппарат</h1>
									<p className="text-xs text-muted-foreground">
										Система мониторинга v.{process.env.APP_VERSION}
									</p>
								</Link>
							}
							actions={<DeviceState />}
						/>
						{children}
						<Footer />
						<StatusDisplay />
					</div>
				</AppProvider>
				<Toaster position="top-center" />
			</body>
		</html>
	)
}
