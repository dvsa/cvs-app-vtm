import { Component, OnDestroy, OnInit, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { EditBaseComponent } from '@forms/custom-sections/edit-base-component/edit-base-component';
import { V3TechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';

@Component({
	selector: 'app-brakes',
	templateUrl: './brakes.component.html',
	styleUrls: ['./brakes.component.scss'],
	imports: [ReactiveFormsModule],
})
export class BrakesComponent extends EditBaseComponent implements OnInit, OnDestroy {
	techRecord = input.required<V3TechRecordModel>();

	form: FormGroup = this.fb.group({});

	ngOnInit(): void {
		// Attach all form controls to parent
		this.init(this.form);

		// Prepopulate form with current tech record
		this.form.patchValue(this.techRecord());
	}

	ngOnDestroy(): void {
		// Detach all form controls from parent
		this.destroy(this.form);
	}

	get controlsBasedOffVehicleType() {
		switch (this.techRecord().techRecord_vehicleType) {
			case VehicleTypes.PSV:
				return this.psvControls;
			case VehicleTypes.TRL:
				return this.trlControls;
			default:
				return {};
		}
	}

	get psvControls() {
		return {};
	}

	get trlControls() {
		return {};
	}
}
