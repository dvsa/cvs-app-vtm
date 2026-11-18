import { Button } from '../../components/button.component';
import { TestResultPage } from './test-result.page';

export class ViewTestResultPage extends TestResultPage {
	readonly heading = this.page.locator('app-vehicle-header #test-name-full');
	readonly vin = this.page.locator('app-vehicle-header #test-vin');
	readonly vrm = this.page.locator('app-vehicle-header #test-testTypeId');
	readonly result = this.page.locator('app-vehicle-header .date_and_result app-tag');
	readonly odometerReading = this.page.locator('#test-odomReading');
	readonly testFacility = this.page.locator('#test-testStationName, #test-testFacilityCombination');
	readonly amendButton = new Button(this.page, 'amend-test');
	readonly cancelTestButton = new Button(this.page, 'cancel-test');
	readonly history = this.page.locator('#test-records-amendment-history');
	readonly historyRows = this.history.locator('tbody tr');

	value(field: string) {
		return this.page.locator(`[id=${JSON.stringify(`test-${field}`)}]`);
	}
}
