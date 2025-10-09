export interface ReceivedData {
	SensorValue: [number, number, number, number]
	SensorBound: [number, number, number, number]
	Reaction: [number, number, number, number]
	ADValue: number
	AFlagsStatus: number
	DrivesStatus: number
	Rate: number
	Total: number
	Dose: number
	Remain: number
	RemainT: number
	stepcounter: number
	backstepcount: number
	stepsFor100: number
	AA?: number
	BB?: number
	CCCC?: number
	DDDD?: number
	EEEE?: number
	FFFF?: number
	TargetV: number
	MeasuredV: number
	StabModeNo: number
	HeatControlStatus: number
	HeatControlSensorNo: number
	HeatControlValue: number
	IsInRange?: number
	IsMaxU?: number
}

export interface ChartDataPoint {
	time: string
	timestamp: number
	T0: number | null
	T1: number | null
	T2: number | null
	T3: number | null
	AD: number | null
}

export interface SensorBounds {
	T0?: number
	T1?: number
	T2?: number
	T3?: number
}
