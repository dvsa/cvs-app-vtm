import { AutoCompleteComponent } from '@/e2e/components/autocomplete.component';
import { CheckboxComponent } from '@/e2e/components/checkbox.component';
import { RadiosComponent } from '@/e2e/components/radios.component';
import { SelectComponent } from '@/e2e/components/select.component';
import { TextInputComponent } from '@/e2e/components/text-input.component';
import { isHeavyTrailer } from '@/e2e/utils/tech-record.util';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { BasePage } from '../../pages/base.page';

export class BrakesSection extends BasePage {
	readonly loadSensingValveRadios = new RadiosComponent(this.page, 'techRecord_brakes_loadSensingValve');
	readonly antilockBrakingSystemRadios = new RadiosComponent(this.page, 'techRecord_brakes_antilockBrakingSystem');
	readonly brakeCodeAutocomplete = new AutoCompleteComponent(this.page, 'techRecord_brakes_brakeCode');
	readonly retarder1Radios = new RadiosComponent(this.page, 'techRecord_brakes_retarderBrakeOne');
	readonly retarder2Radios = new RadiosComponent(this.page, 'techRecord_brakes_retarderBrakeTwo');

	async fill(data: Partial<TechRecordType<'put'>>): Promise<void> {
		if (isHeavyTrailer(data)) {
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

		if (data.techRecord_vehicleType === 'psv') {
			await this.brakeCodeAutocomplete.fill(data.techRecord_brakes_brakeCode);
			await this.retarder1Radios.fill(data.techRecord_brakes_retarderBrakeOne);
			await this.retarder2Radios.fill(data.techRecord_brakes_retarderBrakeTwo);

			// Populate axles
			if (Array.isArray(data.techRecord_axles)) {
				for (const axle of data.techRecord_axles) {
					const parkingBrake = new CheckboxComponent(this.page, `parkingBrakeMrk-${axle.axleNumber}`);
					await parkingBrake.fill(axle.parkingBrakeMrk);
				}
			}
		}
	}
}
