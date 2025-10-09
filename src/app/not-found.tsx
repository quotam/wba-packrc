import Link from 'next/link'

import { Button } from '@front/shared/ui/button'

const NotFoundPage = () => {
	return (
		<div className="my-50 mx-auto flex items-center gap-4 justify-center flex-col">
			<h1 className="text-2xl">404 | Страница не найдена</h1>
			<Button variant="link" asChild>
				<Link href="/">Вернуться на главную</Link>
			</Button>
		</div>
	)
}

export default NotFoundPage
