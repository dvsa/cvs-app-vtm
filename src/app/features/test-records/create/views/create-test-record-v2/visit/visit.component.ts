import { GovukFormGroupAutocompleteComponent } from '@/src/app/forms/components/govuk-form-group-autocomplete/govuk-form-group-autocomplete.component';
import { GovukFormGroupInputComponent } from '@/src/app/forms/components/govuk-form-group-input/govuk-form-group-input.component';
import { FormGroupFrom } from '@/src/app/models/form.model';
import { FormNodeWidth } from '@/src/app/services/dynamic-forms/dynamic-form.types';
import { MultiOptionsService, SpecialRefData } from '@/src/app/services/multi-options/multi-options.service';
import { selectTestStationNames, testStations } from '@/src/app/store/test-stations';
import { Component, OnDestroy, OnInit, inject, input } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TestResultSchema, TestStationTypes } from '@dvsa/cvs-type-definitions/types/v1/test-result';
import { Store } from '@ngrx/store';
import { ReplaySubject, takeUntil } from 'rxjs';

@Component({
	selector: 'app-visit',
	templateUrl: './visit.component.html',
	imports: [FormsModule, ReactiveFormsModule, GovukFormGroupAutocompleteComponent, GovukFormGroupInputComponent],
})
export class VisitComponent implements OnInit, OnDestroy {
	store = inject(Store);
	multiOptionsService = inject(MultiOptionsService);

	form = input.required<FormGroup<FormGroupFrom<TestResultSchema>>>();

	destroy = new ReplaySubject<boolean>(1);
	formNodeWidth = FormNodeWidth;

	testStations = this.store.selectSignal(testStations);
	testStationNames = this.store.selectSignal(selectTestStationNames);
	testStationNamesObservable = this.store.select(selectTestStationNames);

	ngOnInit(): void {
		const form = this.form();
		const testStationName = form.get('testStationName');

		this.multiOptionsService.loadOptions(SpecialRefData.TEST_STATION_P_NUMBER);

		testStationName?.valueChanges.pipe(takeUntil(this.destroy)).subscribe((value) => {
			this.updateTestStation(value);
		});
	}

	ngOnDestroy(): void {
		this.destroy.next(true);
		this.destroy.complete();
	}

	updateTestStation(testStationName: any) {
		const testStations = this.testStations();
		const testStation = testStations.find((station) => station.testStationName === testStationName);
		if (!testStation) return;
		const form = this.form();
		form.get('testStationType')?.patchValue(testStation.testStationType as TestStationTypes);
		form.get('testStationPNumber')?.patchValue(testStation.testStationPNumber);
	}
}
