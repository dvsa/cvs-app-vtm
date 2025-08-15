import { APP_BASE_HREF } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { StatusCodes, TechRecordModel, V3TechRecordModel } from '@models/vehicle-tech-record.model';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { MultiOptionsService } from '@services/multi-options/multi-options.service';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { UserService } from '@services/user-service/user-service';

import { initialAppState } from '@store/index';
import { ReplaySubject, of } from 'rxjs';
import { EditTechRecordButtonComponent } from '../../../edit-tech-record-button/edit-tech-record-button.component';
import { TechRecordHistoryComponent } from '../../../tech-record-history/tech-record-history.component';
import { TechRecordSummaryComponent } from '../../../tech-record-summary/tech-record-summary.component';
import { TechRecordTitleComponent } from '../../../tech-record-title/tech-record-title.component';
import { TestRecordSummaryComponent } from '../../../test-record-summary/test-record-summary.component';
import { VehicleTechnicalRecordComponent } from '../vehicle-technical-record.component';

global.scrollTo = jest.fn();

describe('VehicleTechnicalRecordComponent', () => {
	let component: VehicleTechnicalRecordComponent;
	let fixture: ComponentFixture<VehicleTechnicalRecordComponent>;

	const actions$ = new ReplaySubject<Action>();

	@Component({})
	class TechRecordSummaryStubComponent {
		checkForms() {}
	}

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [
				EditTechRecordButtonComponent,
				TechRecordHistoryComponent,
				TechRecordSummaryComponent,
				TechRecordTitleComponent,
				TechRecordSummaryStubComponent,
				TestRecordSummaryComponent,
				VehicleTechnicalRecordComponent,
			],
			providers: [
				MultiOptionsService,
				provideRouter([]),
				provideHttpClient(),
				provideHttpClientTesting(),
				provideMockStore({ initialState: initialAppState }),
				provideMockActions(() => actions$),
				{ provide: APP_BASE_HREF, useValue: '/' },
				{
					provide: UserService,
					useValue: {
						roles$: of(['TestResult.View', 'TestResult.CreateContingency']),
					},
				},
				{
					provide: TechnicalRecordService,
					useValue: {
						get techRecord$() {
							return of({
								systemNumber: 'foo',
								createdTimestamp: 'bar',
								vin: 'testVin',
								techRecord_statusCode: StatusCodes.CURRENT,
							});
						},
						updateEditingTechRecord: () => {},
						get editableTechRecord$() {
							return of({ systemNumber: 'foo', createdTimestamp: 'bar', vin: 'testVin' });
						},
						get sectionStates$() {
							return of(['TEST_SECTION']);
						},
						getVehicleTypeWithSmallTrl: (techRecord: TechRecordModel) => {
							return techRecord.vehicleType;
						},
					},
				},
			],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(VehicleTechnicalRecordComponent);
		component = fixture.componentInstance;
		fixture.componentRef.setInput('techRecord', {
			systemNumber: 'foo',
			createdTimestamp: 'bar',
			vin: 'testVin',
		} as V3TechRecordModel);
	});

	it('should create', () => {
		fixture.detectChanges();
		expect(component).toBeTruthy();
	});
});
