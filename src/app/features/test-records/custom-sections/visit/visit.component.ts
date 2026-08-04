import { DefaultNullOrEmpty } from '@/src/app/pipes/default-null-or-empty/default-null-or-empty.pipe';
import { FormNodeWidth } from '@/src/app/services/dynamic-forms/dynamic-form.types';
import { TestService } from '@/src/app/services/test/test.service';
import { toEditOrNotToEdit } from '@/src/app/store/test-records';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject, input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TestStationTypes } from '@dvsa/cvs-type-definitions/types/v1/test-result';
import { GovukFormGroupAutocompleteComponent } from '@forms/components/govuk-form-group-autocomplete/govuk-form-group-autocomplete.component';
import { GovukFormGroupDateComponent } from '@forms/components/govuk-form-group-date/govuk-form-group-date.component';
import { GovukFormGroupInputComponent } from '@forms/components/govuk-form-group-input/govuk-form-group-input.component';
import { CommonValidatorsService } from '@forms/validators/common-validators.service';
import { Modes } from '@models/modes.enum';
import { ReferenceDataResourceType, User } from '@models/reference-data.model';
import { Store } from '@ngrx/store';
import { MultiOptionsService, SpecialRefData } from '@services/multi-options/multi-options.service';
import { selectUserByResourceKey } from '@store/reference-data';
import { testStations } from '@store/test-stations';
import { ReplaySubject, takeUntil } from 'rxjs';

@Component({
	selector: 'app-test-visit',
	templateUrl: './visit.component.html',
	imports: [
		FormsModule,
		ReactiveFormsModule,
		GovukFormGroupAutocompleteComponent,
		GovukFormGroupInputComponent,
		DefaultNullOrEmpty,
		GovukFormGroupDateComponent,
	],
	styleUrls: ['./visit.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VisitComponent implements OnInit, OnDestroy {
	store = inject(Store);
	testService = inject(TestService);
	commonValidators = inject(CommonValidatorsService);
	optionsService = inject(MultiOptionsService);

	mode = input.required<Modes>();

	users$ = this.optionsService.getOptions(ReferenceDataResourceType.User);
	testStations$ = this.optionsService.getOptions(SpecialRefData.TEST_STATION_P_NUMBER);
	testStationsState$ = this.store.selectSignal(testStations);
	testResult = this.store.selectSignal(toEditOrNotToEdit);

	destroy$ = new ReplaySubject<boolean>(1);

	form = this.testService.form;

	ngOnInit(): void {
		this.handleTesterDetailChanges();
		this.handleTestStationChanges();
		this.disableRelevantFields();
		this.loadOptions();
		this.addValidators();
	}

	disableRelevantFields(): void {
		this.form.get('testStationType')?.disable();
	}

	addValidators(): void {
		this.form.controls.testStationPNumber.setValidators([this.commonValidators.required('Test station details')]);
		this.form.controls.testerStaffId.setValidators([this.commonValidators.required('Tester details')]);
	}

	loadOptions(): void {
		this.optionsService.loadOptions(ReferenceDataResourceType.User);
		this.optionsService.loadOptions(SpecialRefData.TEST_STATION_P_NUMBER);
	}

	handleTesterDetailChanges(): void {
		this.form.controls.testerStaffId.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
			// patch the rest of the tester details into the form
			if (!value) return;
			const schema = this.store.selectSignal(selectUserByResourceKey(value))();
			if (!schema) return;
			const tester = schema as User;
			this.form.patchValue({ testerName: tester.name, testerEmailAddress: tester.email });
		});
	}

	handleTestStationChanges(): void {
		this.form.controls.testStationPNumber.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
			// patch the rest of the test station details into the form
			if (!value) return;
			const stations = this.testStationsState$();
			if (!stations) return;
			const testStation = stations.find((station) => station.testStationPNumber === value);
			if (!testStation) return;
			this.form.patchValue({
				testStationType: testStation.testStationType as TestStationTypes,
				testStationName: testStation.testStationName,
			});
		});
	}

	ngOnDestroy(): void {
		this.destroy$.next(true);
		this.destroy$.complete();
	}

	protected readonly Modes = Modes;
	protected readonly FormNodeWidth = FormNodeWidth;
}
