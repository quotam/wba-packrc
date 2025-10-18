import Link from 'next/link'

import DeviceState from '@front/app/_widgets/device-state'
import { Badge } from '@front/shared/ui/badge'
import { Button } from '@front/shared/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@front/shared/ui/card'
import { Separator } from '@front/shared/ui/separator'
import {
	AlertTriangle,
	ArrowLeft,
	Bluetooth,
	CheckCircle2,
	Chrome,
	LinkIcon,
	Monitor,
	Settings,
	Smartphone,
	Wifi,
	XCircle
} from 'lucide-react'

export const dynamic = 'force-static'

export default function HelpPage() {
	return (
		<main className="container p-6 space-y-8 max-w-[120rem] sm:p-3">
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Bluetooth className="w-6 h-6 text-primary" />
						Как подключить автоматику?
					</CardTitle>
					<CardDescription>Пошаговая инструкция по подключению через Bluetooth</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					{/* Step 1 */}
					<div className="flex gap-4">
						<div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
							1
						</div>
						<div className="flex-1 space-y-2">
							<h3 className="font-bold text-lg text-foreground">Включите автоматику</h3>
							<p className="text-muted-foreground">
								Убедитесь, что ваша дистилляционная автоматика включена и Bluetooth модуль активен.
								Индикатор Bluetooth должен мигать или гореть постоянно.
							</p>
							<div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
								<Wifi className="w-5 h-5 text-primary" />
								<span className="text-sm text-muted-foreground">
									Автоматика должна находиться в радиусе 10 метров от компьютера
								</span>
							</div>
						</div>
					</div>

					<Separator />

					{/* Step 2 */}
					<div className="flex gap-4">
						<div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
							2
						</div>
						<div className="flex-1 space-y-2">
							<h3 className="font-bold text-lg text-foreground">
								Нажмите кнопку &#34;Подключить устройство&#34;
							</h3>
							<p className="text-muted-foreground">
								На главной странице приложения нажмите кнопку &#34;Подключить устройство&#34; в правом
								верхнем углу.
							</p>
							<div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
								<DeviceState />
							</div>
						</div>
					</div>

					<Separator />

					{/* Step 3 */}
					<div className="flex gap-4">
						<div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
							3
						</div>
						<div className="flex-1 space-y-2">
							<h3 className="font-bold text-lg text-foreground">Выберите автоматику в диалоге</h3>
							<p className="text-muted-foreground">
								Браузер откроет диалоговое окно со списком доступных Bluetooth устройств. Найдите вашу
								автоматику в списке и нажмите &#34;Подключить&#34;.
							</p>
							<div className="flex items-center gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
								<AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-500" />
								<span className="text-sm text-amber-700 dark:text-amber-400">
									Если автоматика не появляется в списке, проверьте, что Bluetooth включен на вашем
									компьютере
								</span>
							</div>
						</div>
					</div>

					<Separator />

					{/* Step 4 */}
					<div className="flex gap-4">
						<div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
							4
						</div>
						<div className="flex-1 space-y-2">
							<h3 className="font-bold text-lg text-foreground">Готово!</h3>
							<p className="text-muted-foreground">
								После успешного подключения индикатор статуса станет зеленым, и вы увидите данные с датчиков
								в реальном времени.
							</p>
							<div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
								<CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-500" />
								<span className="text-sm text-green-700 dark:text-green-400">
									Автоматика подключена и передает данные
								</span>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Platform Support */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Monitor className="w-6 h-6 text-primary" />
						Поддерживаемые платформы
					</CardTitle>
					<CardDescription>Совместимость с операционными системами и браузерами</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{/* Desktop Platforms */}
						<div className="space-y-3">
							<h3 className="font-bold text-foreground flex items-center gap-2">
								<Monitor className="w-5 h-5" />
								Настольные ОС
							</h3>
							<div className="space-y-2">
								<PlatformItem
									name="Windows 10/11"
									supported={true}
									note="Полная поддержка Web Bluetooth API"
								/>
								<PlatformItem name="macOS" supported={true} note="Требуется macOS 10.15 или новее" />
								<PlatformItem name="Linux" supported={true} note="Требуется BlueZ 5.41 или новее" />
								<PlatformItem name="Chrome OS" supported={true} note="Встроенная поддержка" />
							</div>
						</div>

						{/* Mobile Platforms */}
						<div className="space-y-3">
							<h3 className="font-bold text-foreground flex items-center gap-2">
								<Smartphone className="w-5 h-5" />
								Мобильные ОС
							</h3>
							<div className="space-y-2">
								<PlatformItem name="Android 6.0+" supported={true} note="Полная поддержка в Chrome" />
								<PlatformItem
									name="iOS / iPadOS"
									supported={false}
									note="Web Bluetooth не поддерживается Safari"
								/>
							</div>
						</div>
					</div>

					<Separator />

					{/* Browser Support */}
					<div className="space-y-3">
						<h3 className="font-bold text-foreground flex items-center gap-2">
							<Chrome className="w-5 h-5" />
							Поддерживаемые браузеры
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-2">
							<BrowserItem name="Google Chrome" version="56+" supported={true} />
							<BrowserItem name="Microsoft Edge" version="79+" supported={true} />
							<BrowserItem name="Opera" version="43+" supported={true} />
							<BrowserItem name="Brave" version="Последняя" supported={true} />
							<BrowserItem name="Safari" version="Любая" supported={false} />
							<BrowserItem name="Firefox" version="Любая" supported={false} />
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Chrome Flags */}
			<Card className="border-amber-500/20 bg-amber-500/5">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Settings className="w-6 h-6 text-amber-600 dark:text-amber-500" />
						Настройка Chrome (при необходимости)
					</CardTitle>
					<CardDescription>Включение экспериментальных функций Bluetooth</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<p className="text-muted-foreground">
						В некоторых случаях может потребоваться включить экспериментальные флаги Chrome для корректной
						работы Web Bluetooth API:
					</p>

					<div className="space-y-4">
						<div className="space-y-2">
							<h4 className="font-bold text-foreground">Шаг 1: Откройте страницу флагов</h4>
							<div className="flex items-center gap-2 p-3 bg-muted rounded-lg font-mono text-sm">
								<LinkIcon className="w-4 h-4 text-muted-foreground" />
								<code className="text-foreground">chrome://flags</code>
							</div>
							<p className="text-sm text-muted-foreground">
								Скопируйте и вставьте этот адрес в адресную строку Chrome
							</p>
						</div>

						<div className="space-y-2">
							<h4 className="font-bold text-foreground">Шаг 2: Найдите и включите флаги</h4>
							<div className="space-y-2">
								<FlagItem
									flag="enable-web-bluetooth-new-permissions-backend"
									description="Новая система разрешений для Web Bluetooth"
								/>
								<FlagItem
									flag="enable-experimental-web-platform-features"
									description="Экспериментальные веб-функции (опционально)"
								/>
							</div>
						</div>

						<div className="space-y-2">
							<h4 className="font-bold text-foreground">Шаг 3: Перезапустите браузер</h4>
							<p className="text-sm text-muted-foreground">
								После включения флагов нажмите кнопку &#34;Relaunch&#34; для перезапуска Chrome
							</p>
						</div>
					</div>

					<div className="flex items-start gap-2 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
						<AlertTriangle className="w-5 h-5 text-blue-600 dark:text-blue-500 flex-shrink-0 mt-0.5" />
						<div className="text-sm space-y-1">
							<p className="font-bold text-blue-700 dark:text-blue-400">Примечание</p>
							<p className="text-blue-600 dark:text-blue-300">
								В большинстве случаев эти флаги уже включены по умолчанию в современных версиях Chrome.
								Включайте их только если возникают проблемы с подключением.
							</p>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Troubleshooting */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<AlertTriangle className="w-6 h-6 text-primary" />
						Решение проблем
					</CardTitle>
					<CardDescription>Что делать, если автоматика не подключается</CardDescription>
				</CardHeader>
				<CardContent className="space-y-3">
					<TroubleshootItem
						problem="Автоматика не появляется в списке"
						solution="Убедитесь, что Bluetooth включен на компьютере и автоматике. Проверьте, что автоматика находится в радиусе 10 метров."
					/>
					<TroubleshootItem
						problem="Ошибка при подключении"
						solution="Попробуйте перезагрузить автоматику и браузер. Убедитесь, что автоматика не подключена к другому компьютеру или телефону."
					/>
					<TroubleshootItem
						problem="Браузер не поддерживает Web Bluetooth"
						solution="Используйте Google Chrome, Microsoft Edge или Opera. Safari и Firefox не поддерживают Web Bluetooth API."
					/>
				</CardContent>
			</Card>

			{/* Back Button */}
			<div className="flex justify-center pt-4">
				<Link href="/">
					<Button size="lg" className="gap-2">
						<ArrowLeft className="w-5 h-5" />
						Вернуться на главную
					</Button>
				</Link>
			</div>
		</main>
	)
}

function PlatformItem({
	name,
	supported,
	note
}: {
	name: string
	supported: boolean
	note: string
}) {
	return (
		<div className="flex items-start gap-3 p-3 rounded-lg border border-border bg-card">
			{supported ? (
				<CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-500 flex-shrink-0 mt-0.5" />
			) : (
				<XCircle className="w-5 h-5 text-red-600 dark:text-red-500 flex-shrink-0 mt-0.5" />
			)}
			<div className="flex-1 min-w-0">
				<p className="font-medium text-foreground">{name}</p>
				<p className="text-sm text-muted-foreground">{note}</p>
			</div>
		</div>
	)
}

function BrowserItem({
	name,
	version,
	supported
}: {
	name: string
	version: string
	supported: boolean
}) {
	return (
		<div className="flex items-center justify-between p-3 rounded-lg border border-border bg-card">
			<div className="flex items-center gap-2">
				{supported ? (
					<CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-500" />
				) : (
					<XCircle className="w-4 h-4 text-red-600 dark:text-red-500" />
				)}
				<span className="font-medium text-foreground">{name}</span>
			</div>
			<Badge variant={supported ? 'default' : 'secondary'}>{version}</Badge>
		</div>
	)
}

function FlagItem({ flag, description }: { flag: string; description: string }) {
	return (
		<div className="p-3 rounded-lg border border-border bg-card space-y-1">
			<code className="text-sm font-mono text-primary">#{flag}</code>
			<p className="text-sm text-muted-foreground">{description}</p>
		</div>
	)
}

function TroubleshootItem({ problem, solution }: { problem: string; solution: string }) {
	return (
		<div className="p-4 rounded-lg border border-border bg-card space-y-2">
			<h4 className="font-bold text-foreground flex items-center gap-2">
				<AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-500" />
				{problem}
			</h4>
			<p className="text-sm text-muted-foreground pl-6">{solution}</p>
		</div>
	)
}
