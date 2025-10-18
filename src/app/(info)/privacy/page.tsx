import type React from 'react'

import Link from 'next/link'

import { Button } from '@front/shared/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@front/shared/ui/card'
import { Separator } from '@front/shared/ui/separator'
import { ArrowLeft, Bluetooth, Database, Eye, Globe, HardDrive, Lock, Shield } from 'lucide-react'

export const dynamic = 'force-static'

export default function PrivacyPage() {
	return (
		<main className="container p-6 space-y-8 max-w-[120rem] sm:p-3">
			<div className="space-y-8">
				{/* Header */}
				<div className="flex items-center gap-4">
					<Link href="/">
						<Button variant="ghost" size="icon">
							<ArrowLeft className="w-5 h-5" />
						</Button>
					</Link>
					<div>
						<h1 className="text-4xl font-bold text-foreground">Политика конфиденциальности</h1>
						<p className="text-muted-foreground">
							Последнее обновление: {new Date().toLocaleDateString('ru-RU')}
						</p>
					</div>
				</div>

				{/* Introduction */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Shield className="w-6 h-6 text-primary" />
							Введение
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<p className="text-muted-foreground">
							Данное приложение для мониторинга дистилляционного оборудования разработано с учетом
							максимальной защиты вашей конфиденциальности. Мы серьезно относимся к безопасности ваших
							данных и стремимся обеспечить прозрачность в отношении того, как работает наше приложение.
						</p>
						<div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
							<p className="text-sm text-foreground font-semibold">
								Важно: Это приложение работает полностью локально в вашем браузере и не передает никакие
								данные на внешние серверы.
							</p>
						</div>
					</CardContent>
				</Card>

				{/* Data Collection */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Database className="w-6 h-6 text-primary" />
							Сбор данных
						</CardTitle>
						<CardDescription>Какие данные собирает приложение</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-4">
							<DataItem
								icon={<Bluetooth className="w-5 h-5 text-blue-500" />}
								title="Данные с устройства"
								description="Приложение получает данные с вашего дистилляционного оборудования через Bluetooth: показания датчиков температуры, давления, состояние насоса и стабилизатора напряжения."
								storage="Локально в браузере"
							/>

							<DataItem
								icon={<HardDrive className="w-5 h-5 text-green-500" />}
								title="Настройки приложения"
								description="Ваши персональные настройки: калибровочные значения, параметры нагревателя, настройки логирования данных."
								storage="localStorage браузера"
							/>

							<DataItem
								icon={<Database className="w-5 h-5 text-purple-500" />}
								title="История данных"
								description="История показаний датчиков для построения графиков (до 6 часов данных)."
								storage="IndexedDB браузера"
							/>
						</div>

						<Separator />

						<div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg space-y-2">
							<h4 className="font-semibold text-green-700 dark:text-green-400 flex items-center gap-2">
								<Lock className="w-5 h-5" />
								Что мы НЕ собираем
							</h4>
							<ul className="space-y-1 text-sm text-green-600 dark:text-green-300 pl-7">
								<li>• Персональные данные (имя, email, телефон)</li>
								<li>• Геолокацию</li>
								<li>• IP-адрес</li>
								<li>• Информацию об устройстве</li>
								<li>• Cookies для отслеживания</li>
								<li>• Аналитику использования</li>
							</ul>
						</div>
					</CardContent>
				</Card>

				{/* Data Storage */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<HardDrive className="w-6 h-6 text-primary" />
							Хранение данных
						</CardTitle>
						<CardDescription>Где и как хранятся ваши данные</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<p className="text-muted-foreground">
							Все данные хранятся исключительно локально в вашем браузере и никогда не покидают ваше
							устройство:
						</p>

						<div className="space-y-3">
							<StorageItem
								title="localStorage"
								description="Настройки приложения, калибровочные значения, параметры нагревателя"
								size="< 1 МБ"
							/>
							<StorageItem
								title="IndexedDB"
								description="История показаний датчиков за последние 6 часов для построения графиков"
								size="< 10 МБ"
							/>
							<StorageItem
								title="Память браузера"
								description="Текущие данные с устройства в реальном времени (очищаются при закрытии вкладки)"
								size="< 1 МБ"
							/>
						</div>

						<Separator />

						<div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
							<h4 className="font-semibold text-blue-700 dark:text-blue-400 mb-2">Управление данными</h4>
							<p className="text-sm text-blue-600 dark:text-blue-300">
								Вы можете в любой момент удалить все данные приложения через настройки браузера (Очистка
								данных сайта) или через инструменты разработчика (Application → Storage → Clear site data).
							</p>
						</div>
					</CardContent>
				</Card>

				{/* Data Usage */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Eye className="w-6 h-6 text-primary" />
							Использование данных
						</CardTitle>
						<CardDescription>Для чего используются собранные данные</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<p className="text-muted-foreground">
							Данные используются исключительно для функционирования приложения:
						</p>

						<ul className="space-y-2 text-muted-foreground">
							<li className="flex items-start gap-2">
								<span className="text-primary mt-1">•</span>
								<span>Отображение текущих показаний датчиков в реальном времени</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="text-primary mt-1">•</span>
								<span>Построение графиков изменения температуры и давления</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="text-primary mt-1">•</span>
								<span>Управление дистилляционным оборудованием (насос, стабилизатор)</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="text-primary mt-1">•</span>
								<span>Сохранение ваших настроек и калибровочных значений</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="text-primary mt-1">•</span>
								<span>Оповещение о критических состояниях (перегрев, аварийные ситуации)</span>
							</li>
						</ul>

						<div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
							<p className="text-sm text-amber-700 dark:text-amber-400">
								<strong>Важно:</strong> Данные не используются для рекламы, аналитики, профилирования или
								любых других целей, кроме непосредственной работы приложения.
							</p>
						</div>
					</CardContent>
				</Card>

				{/* Data Sharing */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Globe className="w-6 h-6 text-primary" />
							Передача данных третьим лицам
						</CardTitle>
						<CardDescription>Кому передаются ваши данные</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="p-6 bg-green-500/10 border-2 border-green-500/30 rounded-lg text-center mx-4">
							<Lock className="w-12 h-12 text-green-600 dark:text-green-500 mx-auto mb-3" />
							<h3 className="text-xl font-bold text-green-700 dark:text-green-400 mb-2">
								Мы НЕ передаем ваши данные третьим лицам
							</h3>
							<p className="text-green-600  dark:text-green-300">
								Приложение работает полностью автономно. Никакие данные не отправляются на серверы, не
								передаются третьим лицам и не используются для каких-либо целей, кроме работы приложения на
								вашем устройстве.
							</p>
						</div>

						<p className="text-sm text-muted-foreground">
							Единственное сетевое взаимодействие - это загрузка самого приложения при первом открытии.
							После загрузки приложение может работать полностью офлайн.
						</p>
					</CardContent>
				</Card>

				{/* Bluetooth Security */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Bluetooth className="w-6 h-6 text-primary" />
							Безопасность Bluetooth соединения
						</CardTitle>
						<CardDescription>Как защищено соединение с устройством</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<p className="text-muted-foreground">
							Приложение использует Web Bluetooth API для связи с вашим оборудованием:
						</p>

						<ul className="space-y-2 text-muted-foreground">
							<li className="flex items-start gap-2">
								<span className="text-primary mt-1">•</span>
								<span>Соединение устанавливается только после вашего явного разрешения</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="text-primary mt-1">•</span>
								<span>Браузер контролирует доступ к Bluetooth устройствам</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="text-primary mt-1">•</span>
								<span>Данные передаются напрямую между браузером и устройством без посредников</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="text-primary mt-1">•</span>
								<span>Вы можете отключить устройство в любой момент</span>
							</li>
						</ul>
					</CardContent>
				</Card>

				{/* Changes to Policy */}
				<Card>
					<CardHeader>
						<CardTitle>Изменения в политике конфиденциальности</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<p className="text-muted-foreground">
							Мы можем периодически обновлять эту политику конфиденциальности. О существенных изменениях мы
							будем уведомлять пользователей через интерфейс приложения. Дата последнего обновления указана
							в начале документа.
						</p>
					</CardContent>
				</Card>

				{/* Contact */}
				<Card>
					<CardHeader>
						<CardTitle>Контактная информация</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-muted-foreground">
							Если у вас есть вопросы о политике конфиденциальности или о том, как мы обрабатываем ваши
							данные, пожалуйста, свяжитесь с нами через форму обратной связи на сайте.
						</p>
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
			</div>
		</main>
	)
}

function DataItem({
	icon,
	title,
	description,
	storage
}: {
	icon: React.ReactNode
	title: string
	description: string
	storage: string
}) {
	return (
		<div className="flex gap-4 p-4 rounded-lg border border-border bg-card">
			<div className="flex-shrink-0 mt-1">{icon}</div>
			<div className="flex-1 space-y-1">
				<h4 className="font-semibold text-foreground">{title}</h4>
				<p className="text-sm text-muted-foreground">{description}</p>
				<p className="text-xs text-primary font-medium">Хранение: {storage}</p>
			</div>
		</div>
	)
}

function StorageItem({
	title,
	description,
	size
}: {
	title: string
	description: string
	size: string
}) {
	return (
		<div className="flex items-start justify-between gap-4 p-3 rounded-lg border border-border bg-card">
			<div className="flex-1">
				<h4 className="font-semibold text-foreground text-sm">{title}</h4>
				<p className="text-xs text-muted-foreground mt-1">{description}</p>
			</div>
			<div className="text-xs font-mono text-primary bg-primary/10 px-2 py-1 rounded">{size}</div>
		</div>
	)
}
