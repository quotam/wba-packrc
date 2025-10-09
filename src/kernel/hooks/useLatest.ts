import { useLayoutEffect, useRef } from 'react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useLatest(value: any) {
	const latestValue = useRef(value)

	useLayoutEffect(() => {
		latestValue.current = value
	})

	return latestValue
}
