import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject, input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonValidatorsService } from '@forms/validators/common-validators.service';
import { Modes } from '@models/modes.enum';
import { Store } from '@ngrx/store';
import { TestService } from '@services/test/test.service';
import { ReplaySubject } from 'rxjs';

@Component({
	selector: 'app-seatbelts',
	templateUrl: './seatbelts.component.html',
	imports: [FormsModule, ReactiveFormsModule],
	styleUrls: ['./seatbelts.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SeatbeltsComponent implements OnInit, OnDestroy {
	store = inject(Store);
	testService = inject(TestService);
	commonValidators = inject(CommonValidatorsService);

	destroy = new ReplaySubject<boolean>(1);
	form = this.testService.form;
	mode = input.required<Modes>();
	initialMode = input.required<Modes>();

	ngOnInit(): void {
		this.addValidators();
		this.disableFields();
	}

	ngOnDestroy(): void {
		this.destroy.next(true);
		this.destroy.complete();
	}

	addValidators(): void {
		const testTypeGroup = this.form.controls.testTypes.at(0);

		// this.form.controls.contingencyTestNumber.setValidators([
		//   this.commonValidators.applyWhen(
		//     () => this.contingencyTestNumberIsRequired(),
		//     this.commonValidators.required('Contingency Test Number')
		//   ),
		//   this.commonValidators.minLength(6, 'Contingency Test Number'),
		//   this.commonValidators.maxLength(8, 'Contingency Test Number'),
		// ]);
	}

	disableFields(): void {
		// Initially enable all controls
		this.form.enable();

		if (this.initialMode() === Modes.AMEND) {
			this.form.controls.testTypes.at(0).controls.seatbeltInstallationCheckDate.disable();
			this.form.controls.testTypes.at(0).controls.numberOfSeatbeltsFitted.disable();
			this.form.controls.testTypes.at(0).controls.lastSeatbeltInstallationCheckDate.disable();
		}
	}
}
