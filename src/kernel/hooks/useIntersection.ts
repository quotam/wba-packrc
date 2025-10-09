import { useCallback } from 'react'

export const useIntersection = (onIntersect: () => void) => {
	return useCallback(
		(el: HTMLDivElement | null) => {
			const observer = new IntersectionObserver(
				entries => {
					entries.forEach(entry => {
						if (entry.isIntersecting) {
							onIntersect()
						}
					})
				},
				{ rootMargin: '200px' }
			)
			if (el) observer.observe(el)
			return () => observer.disconnect()
		},
		[onIntersect]
	)
}
