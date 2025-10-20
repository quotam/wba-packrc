import { useEffect } from 'react'

import Link from 'next/link'

import { Button } from '@front/shared/ui/button'
import { Home, RefreshCcw } from 'lucide-react'

import { ClientErrorHandleAction } from '../action/errorHandler'

export default function ErrorPage({
	error,
	reset
}: {
	error: Error & { digest?: string }
	reset: () => void
}) {
	useEffect(() => {
		ClientErrorHandleAction(JSON.stringify(error))
	}, [error])

	return (
		<div className="w-svw h-svh flex items-center justify-center">
			<div className="text-center -mt-20">
				<h1 className="text-2xl font-bold mb-4">Что-то пошло не так</h1>
				<div className="flex justify-center gap-2 flex-col items-center">
					<Button onClick={() => reset()}>
						<RefreshCcw className="size-5 mr-2" />
						Попробовать снова
					</Button>
					<Link href="/" passHref>
						<Button variant="outline">
							<Home className="size-5 mr-2" />
							На главную
						</Button>
					</Link>
				</div>
			</div>
		</div>
	)
}
