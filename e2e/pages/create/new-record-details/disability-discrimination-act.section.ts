import { RadiosComponent } from '@/e2e/components/radios.component';
import { TextInputComponent } from '@/e2e/components/text-input.component';
import { TextareaComponent } from '@/e2e/components/textarea.component';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { BasePage } from '../../base.page';

export class DisabilityDiscriminationActSection extends BasePage {
	readonly ddaCertificateIssuedRadios = new RadiosComponent(this.page, 'techRecord_dda_certificateIssued');
	readonly wheelchairFittingsTextarea = new TextareaComponent(this.page, 'techRecord_dda_wheelchairFittings');
	readonly wheelchairLiftPresentRadios = new RadiosComponent(this.page, 'techRecord_dda_wheelchairLiftPresent');
	readonly wheelchairLiftDetailsTextarea = new TextareaComponent(this.page, 'techRecord_dda_wheelchairLiftInformation');
	readonly wheelchairRampPresentRadios = new RadiosComponent(this.page, 'techRecord_dda_wheelchairRampPresent');
	readonly wheelchairRampDetailsTextarea = new TextareaComponent(this.page, 'techRecord_dda_wheelchairRampInformation');
	readonly minimumEmergencyExitsRequiredTextInput = new TextInputComponent(
		this.page,
		'techRecord_dda_minEmergencyExits'
	);
	readonly outswingTextarea = new TextareaComponent(this.page, 'techRecord_dda_outswing');
	readonly ddaSchedulesTextarea = new TextareaComponent(this.page, 'techRecord_dda_ddaSchedules');
	readonly numberOfSeatbeltsFittedTextInput = new TextInputComponent(this.page, 'techRecord_dda_seatbeltsFitted');
	readonly ddaNotesTextarea = new TextareaComponent(this.page, 'techRecord_dda_ddaNotes');

	async fill(data: Partial<TechRecordType<'put'>>): Promise<void> {
		if (data.techRecord_vehicleType !== 'psv') return;

		await this.ddaCertificateIssuedRadios.fill(data.techRecord_dda_certificateIssued);
		await this.wheelchairFittingsTextarea.fill(data.techRecord_dda_wheelchairFittings);
		await this.wheelchairLiftPresentRadios.fill(data.techRecord_dda_wheelchairLiftPresent);
		if (data.techRecord_dda_wheelchairLiftPresent) {
			await this.wheelchairLiftDetailsTextarea.fill(data.techRecord_dda_wheelchairLiftInformation);
		}
		await this.wheelchairRampPresentRadios.fill(data.techRecord_dda_wheelchairRampPresent);
		if (data.techRecord_dda_wheelchairRampPresent) {
			await this.wheelchairRampDetailsTextarea.fill(data.techRecord_dda_wheelchairRampInformation);
		}
		await this.minimumEmergencyExitsRequiredTextInput.fill(data.techRecord_dda_minEmergencyExits);
		await this.outswingTextarea.fill(data.techRecord_dda_outswing);
		await this.ddaSchedulesTextarea.fill(data.techRecord_dda_ddaSchedules);
		await this.numberOfSeatbeltsFittedTextInput.fill(data.techRecord_dda_seatbeltsFitted);
		await this.ddaNotesTextarea.fill(data.techRecord_dda_ddaNotes);
	}
}
