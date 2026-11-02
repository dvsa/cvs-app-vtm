import { Accordion } from '../../components/accordion.component';
import { TechnicalRecordPage } from './technical-record.page';

export class ViewTechnicalRecordPage extends TechnicalRecordPage {
	readonly heading = this.page.getByRole('heading', { name: 'View technical record', exact: true });
	readonly summary = this.page.locator('app-tech-record-summary-card');
	readonly vin = this.summary.locator('#vin');
	readonly vrm = this.summary.locator('#current-vrm');
	readonly trailerId = this.summary.locator('#trailer-id');
	readonly vehicleType = this.summary.locator('#vehicleType');
	readonly statusCode = this.summary.locator('#status-code');
	readonly recordCompleteness = this.summary.locator('#record-completeness');
	readonly removeRequiredFilter = this.page.getByRole('link', { name: 'Remove filter Required', exact: true });
	readonly recordHistory = new Accordion(this.page, 'accordion-control-technical-records-history');
	readonly creationReason = this.page.locator('#tech-record-history-reason-0');
}
