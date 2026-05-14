import { TestService } from '@/src/app/services/test/test.service';
import { Component, OnDestroy, OnInit, inject, input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TestStationTypes } from '@dvsa/cvs-type-definitions/types/v1/test-result';
import { GovukFormGroupAutocompleteComponent } from '@forms/components/govuk-form-group-autocomplete/govuk-form-group-autocomplete.component';
import { GovukFormGroupInputComponent } from '@forms/components/govuk-form-group-input/govuk-form-group-input.component';
import { Modes } from '@models/modes.enum';
import { ReferenceDataResourceType, User } from '@models/reference-data.model';
import { Store, select } from '@ngrx/store';
import { MultiOptionsService, SpecialRefData } from '@services/multi-options/multi-options.service';
import { selectUserByResourceKey } from '@store/reference-data';
import { testStations } from '@store/test-stations';
import { ReplaySubject, catchError, take, takeUntil, tap } from 'rxjs';

@Component({
	selector: 'app-test-visit',
	templateUrl: './visit.component.html',
	imports: [FormsModule, ReactiveFormsModule, GovukFormGroupAutocompleteComponent, GovukFormGroupInputComponent],
	styleUrls: ['./visit.component.scss'],
})
export class VisitComponent implements OnInit, OnDestroy {
	store = inject(Store);
	testService = inject(TestService);
	optionsService = inject(MultiOptionsService);

	mode = input.required<Modes>();

	users$ = this.optionsService.getOptions(ReferenceDataResourceType.User);
	testStations$ = this.optionsService.getOptions(SpecialRefData.TEST_STATION_P_NUMBER);
	testStationsState$ = this.store.select(testStations);

	destroy$ = new ReplaySubject<boolean>(1);

	form = this.testService.form;

	ngOnInit(): void {
		this.handleTesterDetailChanges();
		this.handleTestStationChanges();
		this.loadOptions();
	}

	loadOptions(): void {
		this.optionsService.loadOptions(ReferenceDataResourceType.User);
		this.optionsService.loadOptions(SpecialRefData.TEST_STATION_P_NUMBER);
	}

	handleTesterDetailChanges(): void {
		this.testService.form.controls.testerStaffId.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
			// patch the rest of the tester details into the form
			if (!value) return;
			this.store.pipe(
				select(selectUserByResourceKey(value)),
				take(1),
				tap((user) => {
					if (!user) return;
					const tester = user as User;
					const testerName = this.form.controls.testerName;
					const testerEmail = this.form.controls.testerEmailAddress;
					testerName.setValue(tester.name, { emitEvent: false, onlySelf: true });
					testerEmail.setValue(tester.email, { emitEvent: false, onlySelf: true });
				}),
				catchError(async (error) => console.log(error))
			);
		});
	}

	handleTestStationChanges(): void {
		this.testService.form.controls.testStationPNumber.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
			// patch the rest of the tester details into the form
			if (!value) return;
			this.testStationsState$.subscribe((stations) => {
				if (!stations) return;
				const testStation = stations.find((station) => station.testStationPNumber === value);
				if (!testStation) return;
				const testStationType = this.form.controls.testStationType;
				const testStationName = this.form.controls.testStationName;
				testStationType.setValue(testStation.testStationType as TestStationTypes, { emitEvent: false, onlySelf: true });
				testStationName.setValue(testStation.testStationName, { emitEvent: false, onlySelf: true });
			});
		});
	}

	ngOnDestroy(): void {
		this.destroy$.next(true);
		this.destroy$.complete();
	}
}
