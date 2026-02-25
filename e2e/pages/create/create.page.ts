import { CheckboxComponent } from '@/e2e/components/checkbox.component';
import { RadiosComponent } from '@/e2e/components/radios.component';
import { TextInputComponent } from '@/e2e/components/text-input.component';
import { getVrmOrTrailerId } from '@/e2e/utils/tech-record.util';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { expect } from '@playwright/test';
import { BasePage } from '../base.page';

export class CreatePage extends BasePage {
	// Form controls
	readonly vin = new TextInputComponent(this.page, 'input-vin');
	readonly generateCTZNumber = new CheckboxComponent(this.page, 'generate-c-or-z-num');
	readonly vrmOrTrailerId = new TextInputComponent(this.page, 'input-vrm-or-trailer-id');
	readonly vehicleStatus = new RadiosComponent(this.page, 'change-vehicle-status-select');
	readonly vehicleType = new RadiosComponent(this.page, 'change-vehicle-type-select');

	// Actions
	readonly continueButton = this.page.getByRole('button', { name: 'Continue' });
	readonly cancelButton = this.page.getByRole('button', { name: 'Cancel' });

	async goto(): Promise<void> {
		await this.page.goto('/create');
	}

	async loaded(): Promise<void> {
		await this.page.waitForURL(/\/create/);
		await expect(await this.page.title()).toBe('Vehicle Testing Management - Create new technical record');
	}

	async fill(data: Partial<TechRecordType<'put'>>): Promise<void> {
		await this.vin.fill(data.vin);
		const vrmOrTrailerId = getVrmOrTrailerId(data);
		await this.vrmOrTrailerId.fill(vrmOrTrailerId);
		await this.generateCTZNumber.fill(!vrmOrTrailerId); // check if no VRM or trailer ID
		await this.vehicleStatus.fill(data.techRecord_statusCode);
		await this.vehicleType.fill(data.techRecord_vehicleType);
	}

	async submit(): Promise<void> {
		await this.continueButton.click();
	}
}
