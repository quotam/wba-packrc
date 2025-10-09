import type { MetadataRoute } from 'next'

import { APP_INFO } from '@front/shared/config/publicConfig'

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: APP_INFO.name,
		short_name: APP_INFO.name,
		description: `${APP_INFO.name} : app`,
		start_url: '/',
		display: 'standalone',
		background_color: '#ffffff',
		theme_color: '#000000',
		icons: [
			{
				src: '/web-app-manifest-192x192.png',
				sizes: '192x192',
				type: 'image/png',
				purpose: 'maskable'
			},
			{
				src: '/web-app-manifest-512x512.png',
				sizes: '512x512',
				type: 'image/png',
				purpose: 'maskable'
			}
		]
	}
}
