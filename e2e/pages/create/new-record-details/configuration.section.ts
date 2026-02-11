import { RadiosComponent } from '@/e2e/components/radios.component';
import { SelectComponent } from '@/e2e/components/select.component';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { BasePage } from '../../base.page';

export class ConfigurationSection extends BasePage {
	readonly offRoadVehicleRadios = new RadiosComponent(this.page, 'techRecord_offRoad');
	readonly departmentalVehicleMarkerRadios = new RadiosComponent(this.page, 'techRecord_departmentalVehicleMarker');
	readonly alterationMarkerRadios = new RadiosComponent(this.page, 'techRecord_alterationMarker');
	readonly fuelSystemSelect = new SelectComponent(this.page, 'techRecord_fuelPropulsionSystem');
	readonly roadFriendlySuspensionRadios = new RadiosComponent(this.page, 'techRecord_roadFriendly');

	async fill(data: Partial<TechRecordType<'put'>>): Promise<void> {
		// @TODO: handle other vehicle types
		if (data.techRecord_vehicleType === 'hgv') {
			await this.offRoadVehicleRadios.fill(data.techRecord_offRoad);
			await this.departmentalVehicleMarkerRadios.fill(data.techRecord_departmentalVehicleMarker);
			await this.alterationMarkerRadios.fill(data.techRecord_alterationMarker);
			await this.fuelSystemSelect.fill(data.techRecord_fuelPropulsionSystem);
			await this.roadFriendlySuspensionRadios.fill(data.techRecord_roadFriendly);
		}
	}
}
