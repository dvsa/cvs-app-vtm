import { BasePage } from '../../pages/base.page';

export class SummarySection extends BasePage {
	readonly vehicleType = this.page.locator('//*[@id="vehicle-type"]');
	readonly vin = this.page.locator('//*[@id="vin"]');
	readonly vrm = this.page.locator('//*[@id="current-vrm"]');
	readonly previousVrm = this.page.locator('//*[@id="previous-vrm"]');
	readonly recordType = this.page.locator('//*[@id="status-code"]');
	readonly recordStatus = this.page.locator('//*[@id="record-completeness"]');
	readonly visibilityInVta = this.page.locator('//*[@id="record-visibility"]');
	readonly changeVehicleTypeLink = this.page.locator('//*[@id="change-type-link"]');
	readonly changeVinLink = this.page.locator('//*[@id="change-vin-link"]');
	readonly changeVrmLink = this.page.locator('//*[@id="change-vrm-link"]');
	readonly changeStatusToArchiveLink = this.page.locator('//*[@id="change-status-to-archive-link"]');
	readonly changeRecordVisibilityInVtaLink = this.page.locator('//*[@id="change-record-visibility-in-vta-link"]');
}
