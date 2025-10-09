import { useTheme } from 'next-themes'

export const useThemeHandle = () => {
	const { setTheme, themes } = useTheme()

	const selectHandle = (theme: string) => {
		setTheme(theme)

		const metaThemeColor = document.querySelector('meta[name="theme-color"]')

		if (!metaThemeColor) {
			const meta = document.createElement('meta')
			meta.name = 'theme-color'
			document.head.appendChild(meta)
		}

		document
			.querySelector('meta[name="theme-color"]')
			?.setAttribute('content', theme === 'dark' || theme === 'catana' ? '#000' : '#fff')
	}

	return {
		selectHandle,
		themes
	}
}
