import { PumpControl } from '../pump-control'
import { StabilizerControl } from '../stabilizer-control'

const ControlsPanel = () => {
	return (
		<div className="grid col-span-2 sm:col-span-10 md:col-span-4 grid-cols-1 gap-4">
			<StabilizerControl />
			<PumpControl />
		</div>
	)
}

export default ControlsPanel
