import Link from 'next/link'

import ThemeSwither from '@front/kernel/lib/next-theme/tinySwither'
import { NAVIGATION } from '@front/shared/config/publicConfig'
import { Button } from '@front/shared/ui/button'

const Footer = () => {
	return (
		<footer className="mt-auto p-1 md:mb-28">
			<div className="flex items-center sm:flex-col justify-center">
				<ul className="flex justify-center flex-wrap sm:space-x-0 space-x-1">
					{NAVIGATION.footer.map(item => (
						<li key={item.title}>
							<Button asChild variant="link">
								<Link href={item.href}>{item.title}</Link>
							</Button>
						</li>
					))}
				</ul>
				<ThemeSwither />
			</div>
		</footer>
	)
}

export default Footer
