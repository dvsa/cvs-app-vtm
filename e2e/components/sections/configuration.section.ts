import { RadiosComponent } from '@/e2e/components/radios.component';
import { SelectComponent } from '@/e2e/components/select.component';
import { TextInputComponent } from '@/e2e/components/text-input.component';
import { isHeavyTrailer } from '@/e2e/utils/tech-record.util';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { BasePage } from '../../pages/base.page';

export class ConfigurationSection extends BasePage {
	readonly offRoadVehicleRadios = new RadiosComponent(this.page, 'techRecord_offRoad');
	readonly departmentalVehicleMarkerRadios = new RadiosComponent(this.page, 'techRecord_departmentalVehicleMarker');
	readonly alterationMarkerRadios = new RadiosComponent(this.page, 'techRecord_alterationMarker');
	readonly fuelSystemSelect = new SelectComponent(this.page, 'techRecord_fuelPropulsionSystem');
	readonly roadFriendlySuspensionRadios = new RadiosComponent(this.page, 'techRecord_roadFriendly');
	readonly speedRestrictionTextInput = new TextInputComponent(this.page, 'techRecord_speedRestriction');
	readonly suspensionTypeSelect = new SelectComponent(this.page, 'techRecord_suspensionType');

	async fill(data: Partial<TechRecordType<'put'>>): Promise<void> {
		if (data.techRecord_vehicleType === 'hgv') {
			await this.offRoadVehicleRadios.fill(data.techRecord_offRoad);
			await this.departmentalVehicleMarkerRadios.fill(data.techRecord_departmentalVehicleMarker);
			await this.alterationMarkerRadios.fill(data.techRecord_alterationMarker);
			await this.fuelSystemSelect.fill(data.techRecord_fuelPropulsionSystem);
			await this.roadFriendlySuspensionRadios.fill(data.techRecord_roadFriendly);
		}

		if (isHeavyTrailer(data)) {
			await this.departmentalVehicleMarkerRadios.fill(data.techRecord_departmentalVehicleMarker);
			await this.alterationMarkerRadios.fill(data.techRecord_alterationMarker);
			await this.roadFriendlySuspensionRadios.fill(data.techRecord_roadFriendly);
			await this.suspensionTypeSelect.fill(data.techRecord_suspensionType);
		}

		if (data.techRecord_vehicleType === 'psv') {
			await this.departmentalVehicleMarkerRadios.fill(data.techRecord_departmentalVehicleMarker);
			await this.alterationMarkerRadios.fill(data.techRecord_alterationMarker);
			await this.fuelSystemSelect.fill(data.techRecord_fuelPropulsionSystem);
			await this.speedRestrictionTextInput.fill(data.techRecord_speedRestriction);
		}
	}
}
