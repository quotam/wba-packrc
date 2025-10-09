import type { NextConfig } from 'next'

import withSerwistInit from '@serwist/next'

import { version } from './package.json'

const nextConfig: NextConfig = {
	env: {
		APP_VERSION: version // You can name the environment variable as you prefer
	}
}

const withSerwist = withSerwistInit({
	swSrc: 'src/app/sw.ts',
	swDest: 'public/sw.js'
})

export default process.env.NODE_ENV === 'production' ? withSerwist(nextConfig) : nextConfig
