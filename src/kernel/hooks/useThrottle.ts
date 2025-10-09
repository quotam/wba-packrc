'use client'

import { useMemo } from 'react'

import throttle from 'lodash-es/throttle'

import { useLatest } from './useLatest'

export const useAppThrottle = (callback: unknown, time: number) => {
	const latestCb = useLatest(callback)

	return useMemo(
		() =>
			throttle((...args) => {
				latestCb.current(...args)
			}, time),
		[time, latestCb]
	)
}
