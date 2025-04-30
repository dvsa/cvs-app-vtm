import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { mockDefectList } from '@mocks/mock-defects';
import { mockTestResult } from '@mocks/mock-test-result';
import { Roles } from '@models/roles.enum';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TestRecordsService } from '@services/test-records/test-records.service';
import { UserService } from '@services/user-service/user-service';

import { State, initialAppState } from '@store/index';
import { selectAmendedDefectData, selectedAmendedTestResultState } from '@store/test-records';
import { of } from 'rxjs';
import { BaseTestRecordComponent } from '../../../../components/base-test-record/base-test-record.component';
import { VehicleHeaderComponent } from '../../../../components/vehicle-header/vehicle-header.component';
import { AmendedTestRecordComponent } from '../amended-test-record.component';

describe('AmendedTestRecordComponent', () => {
	let component: AmendedTestRecordComponent;
	let fixture: ComponentFixture<AmendedTestRecordComponent>;
	let store: MockStore<State>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [AmendedTestRecordComponent, BaseTestRecordComponent, VehicleHeaderComponent],
			providers: [
				TestRecordsService,
				provideRouter([]),
				provideHttpClient(),
				provideHttpClientTesting(),
				provideMockStore({ initialState: initialAppState }),
				{
					provide: UserService,
					useValue: {
						roles$: of([Roles.TestResultView]),
					},
				},
			],
		}).compileComponents();
	});

	beforeEach(() => {
		store = TestBed.inject(MockStore);
		store.overrideSelector(selectedAmendedTestResultState, mockTestResult());
		store.overrideSelector(selectAmendedDefectData, mockDefectList());

		fixture = TestBed.createComponent(AmendedTestRecordComponent);
		component = fixture.componentInstance;
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('sets class properties on component init', inject(
		[TestRecordsService],
		(testRecordsService: TestRecordsService) => {
			const amendedTestResultSpy = jest.spyOn(testRecordsService, 'amendedTestResult$', 'get');
			const amendedDefectDataSpy = jest.spyOn(testRecordsService, 'amendedDefectData$', 'get');

			fixture.detectChanges();

			expect(amendedTestResultSpy).toHaveBeenCalled();
			expect(amendedDefectDataSpy).toHaveBeenCalled();
		}
	));
});
