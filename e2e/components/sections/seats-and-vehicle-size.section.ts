import { DateInputComponent } from '@/e2e/components/date-input.component';
import { RadiosComponent } from '@/e2e/components/radios.component';
import { TextInputComponent } from '@/e2e/components/text-input.component';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { BasePage } from '../../pages/base.page';

export class SeatsAndVehicleSizeSection extends BasePage {
	readonly seatsUpperDeckTextInput = new TextInputComponent(this.page, 'techRecord_seatsUpperDeck');
	readonly seatsLowerDeckTextInput = new TextInputComponent(this.page, 'techRecord_seatsLowerDeck');
	readonly standingCapacityTextInput = new TextInputComponent(this.page, 'techRecord_standingCapacity');
	readonly wheelchairCapacityTextInput = new TextInputComponent(this.page, 'techRecord_dda_wheelchairCapacity');
	readonly vehicleClassRadios = new RadiosComponent(this.page, 'techRecord_vehicleClass_description');
	readonly vehicleSizeRadios = new RadiosComponent(this.page, 'techRecord_vehicleSize');
	readonly numberOfSeatbeltsTextInput = new TextInputComponent(this.page, 'techRecord_numberOfSeatbelts');
	readonly seatbeltsInstallationApprovalDateDateInput = new DateInputComponent(
		this.page,
		'techRecord_seatbeltsInstallationApprovalDate'
	);

	async fill(data: Partial<TechRecordType<'put'>>): Promise<void> {
		if (data.techRecord_vehicleType !== 'psv') return;

		await this.seatsUpperDeckTextInput.fill(data.techRecord_seatsUpperDeck);
		await this.seatsLowerDeckTextInput.fill(data.techRecord_seatsLowerDeck);
		await this.standingCapacityTextInput.fill(data.techRecord_standingCapacity);
		await this.wheelchairCapacityTextInput.fill(data.techRecord_dda_wheelchairCapacity);
		await this.vehicleClassRadios.fill(data.techRecord_vehicleClass_description);
		await this.vehicleSizeRadios.fill(data.techRecord_vehicleSize);
		await this.numberOfSeatbeltsTextInput.fill(data.techRecord_numberOfSeatbelts);
	}
}
