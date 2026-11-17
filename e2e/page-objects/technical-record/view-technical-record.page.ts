import { Accordion } from '../../components/accordion.component';
import { Button } from '../../components/button.component';
import { TechnicalRecordPage } from './technical-record.page';

export class ViewTechnicalRecordPage extends TechnicalRecordPage {
	readonly heading = this.page.getByRole('heading', { name: 'View technical record', exact: true });
	readonly amendButton = new Button(this.page, 'bottomedit');
	readonly summary = this.page.locator('app-tech-record-summary-card');
	readonly vin = this.summary.locator('#vin');
	readonly changeVinLink = new Button(this.summary, 'change-vin-link');
	readonly vrm = this.summary.locator('#current-vrm');
	readonly previousVrm = this.summary.locator('#previous-vrm');
	readonly changeVrmLink = new Button(this.summary, 'change-vrm-link');
	readonly trailerId = this.summary.locator('#trailer-id');
	readonly vehicleType = this.summary.locator('#vehicleType');
	readonly statusCode = this.summary.locator('#status-code');
	readonly promoteLink = new Button(this.summary, 'promote-link');
	readonly archiveLink = new Button(this.summary, 'change-status-to-archive-link');
	readonly unarchiveLink = new Button(this.summary, 'unarchive-link');
	readonly recordCompleteness = this.summary.locator('#record-completeness');
	readonly vtaVisibility = this.summary.locator('#record-visibility');
	readonly changeVtaVisibilityLink = new Button(this.summary, 'change-record-visibility-in-vta-link');
	readonly removeRequiredFilter = this.page.getByRole('link', { name: 'Remove filter Required', exact: true });
	readonly recordHistory = new Accordion(this.page, 'accordion-control-technical-records-history');
	readonly creationReason = this.page.locator('#tech-record-history-reason-0');
}
