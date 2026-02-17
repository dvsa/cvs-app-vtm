import { CheckboxComponent } from '@/e2e/components/checkbox.component';
import { RadiosComponent } from '@/e2e/components/radios.component';
import { SelectComponent } from '@/e2e/components/select.component';
import { TextInputComponent } from '@/e2e/components/text-input.component';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { BasePage } from '../../base.page';

export class BrakesSection extends BasePage {
	readonly loadSensingValveRadios = new RadiosComponent(this.page, 'techRecord_brakes_loadSensingValve');
	readonly antilockBrakingSystemRadios = new RadiosComponent(this.page, 'techRecord_brakes_antilockBrakingSystem');

	async fill(data: Partial<TechRecordType<'put'>>): Promise<void> {
		// @TODO: handle other vehicle types
		if (data.techRecord_vehicleType === 'trl') {
			// Populate axles
			if (Array.isArray(data.techRecord_axles)) {
				for (const axle of data.techRecord_axles) {
					const brakeActuatorTextInput = new TextInputComponent(this.page, `brakes_brakeActuator-${axle.axleNumber}`);
					const levelLengthTextInput = new TextInputComponent(this.page, `brakes_leverLength-${axle.axleNumber}`);
					const springBrakeParkingBrakeSelect = new SelectComponent(
						this.page,
						`brakes_springBrakeParking-${axle.axleNumber}`
					);
					const parkingBrake = new CheckboxComponent(this.page, `parkingBrakeMrk-${axle.axleNumber}`);
					await brakeActuatorTextInput.fill(axle.brakes_brakeActuator);
					await levelLengthTextInput.fill(axle.brakes_leverLength);
					await springBrakeParkingBrakeSelect.fill(axle.brakes_springBrakeParking);
					await parkingBrake.fill(axle.parkingBrakeMrk);
				}
			}

			await this.loadSensingValveRadios.fill(data.techRecord_brakes_loadSensingValve);
			await this.antilockBrakingSystemRadios.fill(data.techRecord_brakes_antilockBrakingSystem);
		}
	}
}
