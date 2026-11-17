import type { BatchVehicle } from '../../builders/batch.builder';
import { Button } from '../../components/button.component';
import { Input } from '../../components/input.component';
import { BasePage } from '../base.page';

export class EnterBatchIdentifiersPage extends BasePage {
	readonly heading = this.page.getByRole('heading', { name: /^Enter details for each (HGV|PSV|trailer)$/ });
	readonly confirmButton = new Button(this.page, 'continue-btn');
	readonly addVehicleButton = new Button(this.page, 'add-vehicle-btn');
	readonly cancelButton = new Button(this.page, 'cancel-btn');

	vin(index: number): Input {
		return new Input(this.page, `vin-${index}`);
	}

	identifier(index: number): Input {
		return new Input(this.page, `trailerIdOrVrm-${index}`);
	}

	async fill(vehicles: BatchVehicle[]): Promise<void> {
		for (const [index, vehicle] of vehicles.entries()) {
			await this.vin(index).fill(vehicle.vin);
			if (vehicle.trailerIdOrVrm) await this.identifier(index).fill(vehicle.trailerIdOrVrm);
		}
		await this.heading.click();
	}
}
