'use client'

import { useMemo } from 'react'

import debounce from 'lodash-es/debounce'

import { useLatest } from './useLatest'

export const useAppDebounce = (callback: unknown, time: number) => {
	const latestCb = useLatest(callback)

	return useMemo(
		() =>
			debounce((...args) => {
				latestCb.current(...args)
			}, time),
		[time, latestCb]
	)
}
