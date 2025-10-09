'use client'

import { useEffect, useRef } from 'react'

import { toast } from 'sonner'

import { useStatus } from '../use-status'

const TOAST_ID = 'status-toast'

export function StatusDisplay() {
	const prevStatusRef = useRef<string | null>(null)

	const status = useStatus()

	useEffect(() => {
		const currentStatusText = status?.text || null

		if (prevStatusRef.current !== currentStatusText) {
			if (status) {
				toast(<div className={status.color}>{status.text}</div>, {
					id: TOAST_ID,
					duration: Infinity,
					action: {
						label: 'Скрыть',
						onClick: () => toast.dismiss(TOAST_ID)
					}
				})
			} else {
				toast.dismiss(TOAST_ID)
			}

			prevStatusRef.current = currentStatusText
		}
	}, [status])

	return null
}
