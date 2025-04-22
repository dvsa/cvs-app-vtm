import { TechnicalRecordService } from '@/src/app/services/technical-record/technical-record.service';
import { Component, inject } from '@angular/core';
import { PSVAxles } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/psv/skeleton';
import { TRLAxles } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/trl/skeleton';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { DefaultNullOrEmpty } from '@pipes/default-null-or-empty/default-null-or-empty.pipe';
import { State } from '@store/index';
import { techRecord } from '@store/technical-records';

@Component({
	selector: 'app-brakes-section-view',
	templateUrl: './brakes-section-view.component.html',
	styleUrls: ['./brakes-section-view.component.scss'],
	imports: [DefaultNullOrEmpty],
})
export class BrakesSectionViewComponent {
	protected readonly VehicleTypes = VehicleTypes;
	protected readonly store = inject<Store<State>>(Store);

	trs = inject(TechnicalRecordService);
	techRecord = this.store.selectSignal(techRecord);

	// TODO: potentially improve this
	get axles() {
		const tr = this.techRecord() as TechRecordType<'psv' | 'trl'>;
		return (tr?.techRecord_axles ?? []) as PSVAxles[] | TRLAxles[];
	}

	getTRLAxles(axles: unknown): TRLAxles[] {
		return axles as TRLAxles[];
	}

	round(n: number): number {
		return Math.round(n);
	}
}
