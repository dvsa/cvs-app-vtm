import { DefaultNullOrEmpty } from '@/src/app/pipes/default-null-or-empty/default-null-or-empty.pipe';
import { FormNodeWidth } from '@/src/app/services/dynamic-forms/dynamic-form.types';
import { TestService } from '@/src/app/services/test/test.service';
import { toEditOrNotToEdit } from '@/src/app/store/test-records';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { FormField } from '@angular/forms/signals';
import { TestStationTypes } from '@dvsa/cvs-type-definitions/types/v1/test-result';
import { GovukFormGroupAutocompleteComponent } from '@forms/components/govuk-form-group-autocomplete/govuk-form-group-autocomplete.component';
import { GovukFormGroupInputComponent } from '@forms/components/govuk-form-group-input/govuk-form-group-input.component';
import { ReferenceDataResourceType, User } from '@models/reference-data.model';
import { Store } from '@ngrx/store';
import { MultiOptionsService, SpecialRefData } from '@services/multi-options/multi-options.service';
import { selectUserByResourceKey } from '@store/reference-data';
import { testStations } from '@store/test-stations';

@Component({
	selector: 'app-test-visit',
	templateUrl: './visit.component.html',
	imports: [FormField, GovukFormGroupAutocompleteComponent, GovukFormGroupInputComponent, DefaultNullOrEmpty],
	styleUrls: ['./visit.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VisitComponent implements OnInit {
	store = inject(Store);
	testService = inject(TestService);
	optionsService = inject(MultiOptionsService);

	users$ = this.optionsService.getOptions(ReferenceDataResourceType.User);
	testStations$ = this.optionsService.getOptions(SpecialRefData.TEST_STATION_P_NUMBER);
	private readonly testStationsState = this.store.selectSignal(testStations);
	testResult = this.store.selectSignal(toEditOrNotToEdit);

	form = this.testService.form;

	updateTestStationDetails(number: string | number | boolean | null): void {
		if (!number) return;
		const station = this.testStationsState()?.find(({ testStationPNumber }) => testStationPNumber === number);
		if (!station) return;
		this.testService.patch({
			testStationName: station.testStationName,
			testStationType: station.testStationType as TestStationTypes,
		});
	}

	ngOnInit(): void {
		this.optionsService.loadOptions(ReferenceDataResourceType.User);
		this.optionsService.loadOptions(SpecialRefData.TEST_STATION_P_NUMBER);
	}

	updateTesterDetails(staffId: string | number | boolean | null): void {
		if (typeof staffId !== 'string' || !staffId) return;
		const tester = this.store.selectSignal(selectUserByResourceKey(staffId))() as User | undefined;
		if (!tester) return;
		this.testService.patch({ testerName: tester.name, testerEmailAddress: tester.email });
	}

	protected readonly FormNodeWidth = FormNodeWidth;
}
