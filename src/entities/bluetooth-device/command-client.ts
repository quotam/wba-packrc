/**
 *
 * Device Command API Client
 * Sending commands with validation and formatting
 * Based on the original application's command protocol
 */

export enum StabilizerMode {
	Normal = 0,
	Force = 1,
	Stop = 2
}

export class DeviceCommandClient {
	private sendCommand: (command: string) => Promise<void>

	private static readonly RATE_MIN = 0
	private static readonly RATE_MAX = 3000
	private static readonly DOSE_MIN = 0
	private static readonly DOSE_MAX = 5000
	private static readonly TARGET_VOLTAGE_MIN = 0
	private static readonly TARGET_VOLTAGE_MAX = 2500 // 0-250.0V with 0.1V precision
	private static readonly SENSOR_TEMP_MIN = -55
	private static readonly SENSOR_TEMP_MAX = 127
	private static readonly SENSOR_INDEX_MIN = 0
	private static readonly SENSOR_INDEX_MAX = 3
	private static readonly MODE_VALUES = [0, 1, 2] as const

	constructor(sendCommand: (command: string) => Promise<void>) {
		this.sendCommand = sendCommand
	}

	/**
	 * Calibrate pump with new steps for 100ml
	 * Always saves to EEPROM
	 * @param newStepsFor100 - New calibration value for 100ml
	 */
	async pumpCalibrate(newStepsFor100: number): Promise<void> {
		await this.sendCommand(`Z1${this.toHex8(newStepsFor100)}\r`)
	}

	/**
	 * Set sensor temperature bound (margin) with reaction code
	 * @param sensorIndex - Sensor index (0-3)
	 * @param bound - Temperature bound value
	 * @param reaction - Reaction code
	 */
	async setSensorBound(sensorIndex: number, bound: number, reaction: number): Promise<void> {
		const marginHex = this.toHex4(Math.round(bound * 16))
		const reactionHex = reaction.toString(16).toUpperCase()
		const command = `M${sensorIndex}${marginHex}${reactionHex}\r`
		await this.sendCommand(command)
	}

	/**
	 * Configure heat control (force control) settings
	 * @param forceBound - Temperature bound value
	 * @param forceControlEnabled - Whether heat control is enabled
	 * @param forceSensorNo - Sensor to monitor (0-3)
	 */
	async toggleForceControl(
		forceBound: number,
		forceControlEnabled: boolean,
		forceSensorNo: number
	): Promise<void> {
		const tempValue = Math.round(forceBound * 16)
		const command = `Y${forceControlEnabled ? '1' : '0'}${forceControlEnabled ? forceSensorNo : ''}${forceControlEnabled ? this.toHex4(tempValue) : ''}\r`
		await this.sendCommand(command)
	}

	/**
	 * Initialize device and request steps for 100ml
	 * Sent automatically on connection
	 */
	async sendZ0(): Promise<void> {
		await this.sendCommand('Z0\r')
	}

	/**
	 * Reset total counter to zero
	 */
	async resetTotalCounter(): Promise<void> {
		await this.sendCommand('Z1\r')
	}

	/**
	 * Calibrate pump with new steps for 100ml
	 * @param newStepsFor100ml - New calibration value for 100ml
	 * @param saveToEEPROM - Whether to save the value to EEPROM (default: false)
	 */
	async calibratePump(newStepsFor100ml: number, saveToEEPROM = false): Promise<void> {
		if (newStepsFor100ml < 0 || newStepsFor100ml > 0xffffffff) {
			throw new Error(`Steps for 100ml must be between 0 and ${0xffffffff}`)
		}
		const save = saveToEEPROM ? '1' : '0'
		const stepsHex = this.toHex8(Math.round(newStepsFor100ml))
		await this.sendCommand(`Z${save}${stepsHex}\r`)
	}

	/**
	 * Change stabilizer mode
	 * @param mode - 0: Normal, 1: Force, 2: Stop
	 */
	async setStabilizerMode(mode: StabilizerMode): Promise<void> {
		if (!DeviceCommandClient.MODE_VALUES.includes(mode)) {
			throw new Error(`Invalid stabilizer mode: ${mode}. Must be 0 (Normal), 1 (Force), or 2 (Stop)`)
		}
		await this.sendCommand(`U${mode}\r`)
	}

	/**
	 * Set stabilizer to Normal mode
	 */
	async setStabilizerNormal(): Promise<void> {
		await this.setStabilizerMode(StabilizerMode.Normal)
	}

	/**
	 * Set stabilizer to Force mode
	 */
	async setStabilizerForce(): Promise<void> {
		await this.setStabilizerMode(StabilizerMode.Force)
	}

	/**
	 * Set stabilizer to Stop mode
	 */
	async setStabilizerStop(): Promise<void> {
		await this.setStabilizerMode(StabilizerMode.Stop)
	}

	/**
	 * Set pump rate (speed)
	 * @param rate - Rate value (0-3000)
	 */
	async setPumpRate(rate: number): Promise<void> {
		const validatedRate = this.validateAndClamp(
			rate,
			DeviceCommandClient.RATE_MIN,
			DeviceCommandClient.RATE_MAX,
			'Rate'
		)

		const hexValue = this.toHex4(validatedRate)
		await this.sendCommand(`P${hexValue}\r`)
	}

	/**
	 * Set dose/remain value
	 * @param dose - Dose value (0-5000)
	 */
	async setDose(dose: number): Promise<void> {
		const validatedDose = this.validateAndClamp(
			dose,
			DeviceCommandClient.DOSE_MIN,
			DeviceCommandClient.DOSE_MAX,
			'Dose'
		)

		const hexValue = this.toHex4(validatedDose)
		await this.sendCommand(`V${hexValue}\r`)
	}

	/**
	 * Start pump
	 */
	async startPump(): Promise<void> {
		await this.sendCommand('R0\r')
	}

	/**
	 * Stop pump (by setting rate to 0)
	 */
	async stopPump(): Promise<void> {
		await this.setPumpRate(0)
	}

	/**
	 * Set target voltage for stabilizer
	 * @param targetVoltage - Target voltage value (0-2500, representing 0-250.0V with 0.1V precision)
	 */
	async setTargetVoltage(targetVoltage: number): Promise<void> {
		const validatedVoltage = this.validateAndClamp(
			targetVoltage,
			DeviceCommandClient.TARGET_VOLTAGE_MIN,
			DeviceCommandClient.TARGET_VOLTAGE_MAX,
			'Target voltage'
		)

		await this.sendCommand(`T${this.toHex4(validatedVoltage)}\r`)
	}

	/**
	 * Configure heat control (force control) settings
	 * @param enabled - Whether heat control is enabled
	 * @param sensorIndex - Sensor to monitor (0-3, only used when enabled)
	 * @param forceBoundCelsius - Temperature bound in Celsius (only used when enabled)
	 */
	async setHeatControl(
		enabled: boolean,
		sensorIndex?: number,
		forceBoundCelsius?: number
	): Promise<void> {
		if (enabled) {
			// Validate parameters when enabled
			if (sensorIndex === undefined || forceBoundCelsius === undefined) {
				throw new Error('Sensor index and force bound are required when heat control is enabled')
			}

			if (
				sensorIndex < DeviceCommandClient.SENSOR_INDEX_MIN ||
				sensorIndex > DeviceCommandClient.SENSOR_INDEX_MAX
			) {
				throw new Error(
					`Sensor index must be between ${DeviceCommandClient.SENSOR_INDEX_MIN} and ${DeviceCommandClient.SENSOR_INDEX_MAX}`
				)
			}

			const validatedTemp = this.validateAndClamp(
				forceBoundCelsius,
				DeviceCommandClient.SENSOR_TEMP_MIN,
				DeviceCommandClient.SENSOR_TEMP_MAX,
				'Force bound temperature'
			)

			// Scale temperature by 16
			const tempScaled = Math.round(validatedTemp * 16)
			const tempHex = this.toHex4(tempScaled)

			const command = `Y1${sensorIndex}${tempHex}\r`
			await this.sendCommand(command)
		} else {
			// When disabled, only send Y0
			const command = 'Y0\r'
			await this.sendCommand(command)
		}
	}

	// Helper methods

	/**
	 * Validate and clamp value to min/max range
	 */
	private validateAndClamp(value: number, min: number, max: number, paramName: string): number {
		if (isNaN(value) || !isFinite(value)) {
			throw new Error(`${paramName} must be a valid number`)
		}

		const rounded = Math.round(value)

		if (rounded < min) {
			console.warn(
				`[DeviceCommandClient] ${paramName} ${rounded} is below minimum ${min}, clamping to ${min}`
			)
			return min
		}

		if (rounded > max) {
			console.warn(
				`[DeviceCommandClient] ${paramName} ${rounded} is above maximum ${max}, clamping to ${max}`
			)
			return max
		}

		return rounded
	}

	/**
	 * Convert number to 4-digit hex string (uppercase)
	 * @param value - Number to convert (0-65535)
	 */
	private toHex4(value: number): string {
		if (value < 0 || value > 0xffff) {
			throw new Error(`Value ${value} is out of range for 4-digit hex (0-65535)`)
		}
		return value.toString(16).toUpperCase().padStart(4, '0')
	}

	/**
	 * Convert number to 8-digit hex string (uppercase)
	 * @param value - Number to convert (0-4294967295)
	 */
	private toHex8(value: number): string {
		if (value < 0 || value > 0xffffffff) {
			throw new Error(`Value ${value} is out of range for 8-digit hex (0-4294967295)`)
		}
		return value.toString(16).toUpperCase().padStart(8, '0')
	}
}
