import { DataChart } from '@front/features/chart/pup/data-chart'
import ControlsPanel from '@front/features/control/pub/controls-panel'
import SensorsPanel from '@front/features/sensor/pub/sensors-panel'

export default function Home() {
	return (
		<main className="container p-4 sm:p-2 space-y-4 ">
			<div className="grid grid-cols-10 gap-4">
				<ControlsPanel />
				<div className="col-span-6 sm:col-span-10 space-y-4">
					<DataChart />
				</div>
				<SensorsPanel />
			</div>
		</main>
	)
}
