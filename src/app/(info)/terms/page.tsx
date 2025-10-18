import Link from 'next/link'

import { Button } from '@front/shared/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@front/shared/ui/card'
import { Separator } from '@front/shared/ui/separator'
import { AlertTriangle, ArrowLeft, Ban, FileText, Scale, Shield } from 'lucide-react'

export const dynamic = 'force-static'

export default function TermsPage() {
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
						<h1 className="text-4xl font-bold text-foreground">Пользовательское соглашение</h1>
						<p className="text-muted-foreground">
							Последнее обновление: {new Date().toLocaleDateString('ru-RU')}
						</p>
					</div>
				</div>

				{/* Introduction */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<FileText className="w-6 h-6 text-primary" />
							Введение
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<p className="text-muted-foreground">
							Настоящее Пользовательское соглашение (далее - &#34;Соглашение&#34;) регулирует использование
							веб-приложения для мониторинга и управления дистилляционным оборудованием (далее -
							&#34;Приложение&#34;). Используя Приложение, вы соглашаетесь с условиями данного Соглашения.
						</p>
						<div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
							<p className="text-sm text-amber-700 dark:text-amber-400 font-semibold">
								Если вы не согласны с условиями данного Соглашения, пожалуйста, не используйте Приложение.
							</p>
						</div>
					</CardContent>
				</Card>

				{/* Acceptance */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Scale className="w-6 h-6 text-primary" />
							Принятие условий
						</CardTitle>
						<CardDescription>Как вы принимаете это соглашение</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<p className="text-muted-foreground">Используя Приложение, вы подтверждаете, что:</p>
						<ul className="space-y-2 text-muted-foreground">
							<li className="flex items-start gap-2">
								<span className="text-primary mt-1">•</span>
								<span>Вы прочитали и поняли условия данного Соглашения</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="text-primary mt-1">•</span>
								<span>Вы согласны соблюдать все условия и положения</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="text-primary mt-1">•</span>
								<span>Вы достигли совершеннолетия в вашей юрисдикции</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="text-primary mt-1">•</span>
								<span>
									Вы имеете право использовать дистилляционное оборудование в соответствии с местным
									законодательством
								</span>
							</li>
						</ul>
					</CardContent>
				</Card>

				{/* License */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Shield className="w-6 h-6 text-primary" />
							Лицензия на использование
						</CardTitle>
						<CardDescription>Ваши права при использовании приложения</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<p className="text-muted-foreground">
							Мы предоставляем вам ограниченную, неисключительную, непередаваемую лицензию на использование
							Приложения для личных некоммерческих целей.
						</p>

						<Separator />

						<div className="space-y-3">
							<h4 className="font-semibold text-foreground">Вам разрешается:</h4>
							<ul className="space-y-2 text-muted-foreground">
								<li className="flex items-start gap-2">
									<span className="text-green-600 dark:text-green-500 mt-1">✓</span>
									<span>Использовать Приложение для мониторинга вашего оборудования</span>
								</li>
								<li className="flex items-start gap-2">
									<span className="text-green-600 dark:text-green-500 mt-1">✓</span>
									<span>Сохранять данные локально на вашем устройстве</span>
								</li>
								<li className="flex items-start gap-2">
									<span className="text-green-600 dark:text-green-500 mt-1">✓</span>
									<span>Настраивать параметры приложения под ваши нужды</span>
								</li>
							</ul>
						</div>

						<Separator />

						<div className="space-y-3">
							<h4 className="font-semibold text-foreground">Вам запрещается:</h4>
							<ul className="space-y-2 text-muted-foreground">
								<li className="flex items-start gap-2">
									<span className="text-red-600 dark:text-red-500 mt-1">✗</span>
									<span>Использовать Приложение для незаконной деятельности</span>
								</li>
							</ul>
						</div>
					</CardContent>
				</Card>

				{/* Disclaimer */}
				<Card className="border-amber-500/20 bg-amber-500/5">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-500" />
							Отказ от ответственности
						</CardTitle>
						<CardDescription>Важная информация об ограничениях ответственности</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg space-y-3">
							<p className="text-sm text-amber-700 dark:text-amber-400 font-semibold">
								ПРИЛОЖЕНИЕ ПРЕДОСТАВЛЯЕТСЯ &#34;КАК ЕСТЬ&#34; БЕЗ КАКИХ-ЛИБО ГАРАНТИЙ
							</p>
							<p className="text-sm text-amber-600 dark:text-amber-300">
								Мы не гарантируем, что Приложение будет работать без ошибок, непрерывно или безопасно.
								Использование Приложения осуществляется на ваш собственный риск.
							</p>
						</div>

						<Separator />

						<div className="space-y-3">
							<h4 className="font-semibold text-foreground">Мы не несем ответственности за:</h4>
							<ul className="space-y-2 text-muted-foreground text-sm">
								<li className="flex items-start gap-2">
									<span className="text-amber-600 dark:text-amber-500 mt-1">⚠</span>
									<span>Повреждение или неисправность вашего дистилляционного оборудования</span>
								</li>
								<li className="flex items-start gap-2">
									<span className="text-amber-600 dark:text-amber-500 mt-1">⚠</span>
									<span>Потерю данных или настроек</span>
								</li>
								<li className="flex items-start gap-2">
									<span className="text-amber-600 dark:text-amber-500 mt-1">⚠</span>
									<span>Прямые или косвенные убытки, возникшие в результате использования Приложения</span>
								</li>
								<li className="flex items-start gap-2">
									<span className="text-amber-600 dark:text-amber-500 mt-1">⚠</span>
									<span>Ошибки в показаниях датчиков или неправильную работу оборудования</span>
								</li>
								<li className="flex items-start gap-2">
									<span className="text-amber-600 dark:text-amber-500 mt-1">⚠</span>
									<span>Несовместимость с вашим оборудованием или браузером</span>
								</li>
							</ul>
						</div>
					</CardContent>
				</Card>

				{/* User Responsibilities */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Shield className="w-6 h-6 text-primary" />
							Обязанности пользователя
						</CardTitle>
						<CardDescription>Ваша ответственность при использовании приложения</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<p className="text-muted-foreground">Используя Приложение, вы обязуетесь:</p>
						<ul className="space-y-2 text-muted-foreground">
							<li className="flex items-start gap-2">
								<span className="text-primary mt-1">•</span>
								<span>
									Соблюдать все применимые законы и правила, касающиеся использования дистилляционного
									оборудования
								</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="text-primary mt-1">•</span>
								<span>Следить за безопасностью работы оборудования и не оставлять его без присмотра</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="text-primary mt-1">•</span>
								<span>Регулярно проверять показания датчиков и состояние оборудования</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="text-primary mt-1">•</span>
								<span>Не полагаться исключительно на Приложение для контроля критических параметров</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="text-primary mt-1">•</span>
								<span>Использовать Приложение только с совместимым и исправным оборудованием</span>
							</li>
						</ul>

						<div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
							<p className="text-sm text-red-700 dark:text-red-400 font-semibold">
								Важно: Приложение является вспомогательным инструментом и не заменяет необходимость личного
								контроля за работой оборудования. Всегда соблюдайте правила безопасности.
							</p>
						</div>
					</CardContent>
				</Card>

				{/* Prohibited Uses */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Ban className="w-6 h-6 text-primary" />
							Запрещенное использование
						</CardTitle>
						<CardDescription>Действия, которые строго запрещены</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<p className="text-muted-foreground">Вам запрещается использовать Приложение для:</p>
						<ul className="space-y-2 text-muted-foreground">
							<li className="flex items-start gap-2">
								<span className="text-red-600 dark:text-red-500 mt-1">✗</span>
								<span>Незаконного производства алкогольной продукции</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="text-red-600 dark:text-red-500 mt-1">✗</span>
								<span>Производства опасных или запрещенных веществ</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="text-red-600 dark:text-red-500 mt-1">✗</span>
								<span>Любой деятельности, нарушающей законы вашей страны</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="text-red-600 dark:text-red-500 mt-1">✗</span>
								<span>Коммерческого производства без соответствующих лицензий</span>
							</li>
						</ul>
					</CardContent>
				</Card>

				{/* Termination */}
				<Card>
					<CardHeader>
						<CardTitle>Прекращение использования</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<p className="text-muted-foreground">
							Мы оставляем за собой право ограничить или прекратить ваш доступ к Приложению в любое время
							без предварительного уведомления, если вы нарушаете условия данного Соглашения.
						</p>
						<p className="text-muted-foreground">
							Вы можете прекратить использование Приложения в любое время, просто закрыв его и удалив все
							связанные данные из вашего браузера.
						</p>
					</CardContent>
				</Card>

				{/* Changes to Terms */}
				<Card>
					<CardHeader>
						<CardTitle>Изменения в соглашении</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<p className="text-muted-foreground">
							Мы можем периодически обновлять условия данного Соглашения. О существенных изменениях мы
							будем уведомлять пользователей через интерфейс Приложения. Продолжая использовать Приложение
							после внесения изменений, вы соглашаетесь с новыми условиями.
						</p>
						<p className="text-muted-foreground">
							Дата последнего обновления указана в начале документа. Рекомендуем периодически проверять эту
							страницу на наличие изменений.
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Применимое право</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-muted-foreground">
							Данное Соглашение регулируется и толкуется в соответствии с законодательством вашей страны.
							Любые споры, возникающие в связи с использованием Приложения, подлежат разрешению в
							соответствии с применимым законодательством.
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Контактная информация</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-muted-foreground">
							Если у вас есть вопросы о данном Пользовательском соглашении, пожалуйста, свяжитесь с нами
							через форму обратной связи на сайте.
						</p>
					</CardContent>
				</Card>

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
