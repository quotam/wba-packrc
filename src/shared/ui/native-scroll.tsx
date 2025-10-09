'use client'

import React from 'react'

import { ChevronLeft, ChevronRight } from 'lucide-react'

import { cn } from '../lib/utils'

interface NativeScrollProps extends React.HTMLAttributes<HTMLDivElement> {
	wrapperClassName?: string
	scrollToItemId?: string
}

const NativeScroll = React.forwardRef<HTMLDivElement, NativeScrollProps>(
	({ className, wrapperClassName, scrollToItemId, ...props }, ref) => {
		const scrollContainerRef = React.useRef<HTMLDivElement>(null)
		React.useImperativeHandle(ref, () => scrollContainerRef.current!)

		const [showLeftArrow, setShowLeftArrow] = React.useState(false)
		const [showRightArrow, setShowRightArrow] = React.useState(false)

		const scrollToItem = React.useCallback(() => {
			if (!scrollToItemId || !scrollContainerRef.current) return

			const targetElement = document.getElementById(scrollToItemId)
			if (targetElement && scrollContainerRef.current.contains(targetElement)) {
				const container = scrollContainerRef.current
				const targetRect = targetElement.getBoundingClientRect()
				const containerRect = container.getBoundingClientRect()

				container.scrollTo({
					left: targetRect.left - containerRect.left + container.scrollLeft,
					behavior: 'smooth'
				})
			}
		}, [scrollToItemId])

		// Эффект для вызова scrollToItem при изменении scrollToItemId
		React.useEffect(() => {
			scrollToItem()
		}, [scrollToItem, scrollToItemId])

		// Эффект для инициализации и обработки изменений размера
		React.useEffect(() => {
			const container = scrollContainerRef.current
			if (!container) return

			const handleResize = () => {
				setShowLeftArrow(container.scrollLeft > 0)
				setShowRightArrow(container.scrollLeft < container.scrollWidth - container.clientWidth)
			}

			const observer = new ResizeObserver(handleResize)
			observer.observe(container)

			// Первоначальная проверка стрелок
			handleResize()

			return () => {
				observer.disconnect()
			}
		}, [])

		const scroll = (direction: 'left' | 'right') => {
			const container = scrollContainerRef.current
			if (!container) return

			const scrollAmount = container.clientWidth * 0.8
			const delta = direction === 'left' ? -scrollAmount : scrollAmount

			container.scrollBy({ left: delta, behavior: 'smooth' })
		}

		const handleScroll = React.useCallback(() => {
			const container = scrollContainerRef.current
			if (!container) return

			setShowLeftArrow(container.scrollLeft > 0)
			setShowRightArrow(container.scrollLeft < container.scrollWidth - container.clientWidth)
		}, [])

		const handleWheel = React.useCallback((event: React.WheelEvent<HTMLDivElement>) => {
			const container = scrollContainerRef.current
			if (!container) return

			container.scrollBy({ left: event.deltaY * 1.4, behavior: 'smooth' })
		}, [])

		return (
			<div className={cn('relative', wrapperClassName)}>
				{showLeftArrow && (
					<button
						aria-label="Prev"
						onClick={e => {
							e.preventDefault()
							scroll('left')
						}}
						className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-full flex items-center justify-start bg-gradient-to-r from-background to-transparent"
					>
						<ChevronLeft strokeWidth={3} className="size-5 sm:size-4 text-accent-foreground" />
					</button>
				)}
				<div
					{...props}
					ref={scrollContainerRef}
					onScroll={handleScroll}
					onWheel={handleWheel}
					className={cn(
						'overflow-x-auto scrollbar-hide flex gap-4 items-center overscroll-contain snap-mandatory sm:overscroll-y-auto snap-x snap-start scroll-p-4 pr-6',
						className
					)}
				/>
				{showRightArrow && (
					<button
						aria-label="Next"
						onClick={e => {
							e.preventDefault()
							scroll('right')
						}}
						className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-full flex items-center justify-end bg-gradient-to-l from-background to-transparent"
					>
						<ChevronRight strokeWidth={3} className="size-5 sm:size-4 text-accent-foreground" />
					</button>
				)}
			</div>
		)
	}
)

NativeScroll.displayName = 'NativeScroll'

export default NativeScroll
