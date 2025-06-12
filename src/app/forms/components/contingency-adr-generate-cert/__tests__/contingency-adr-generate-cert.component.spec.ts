import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { V3TechRecordModel } from '@models/vehicle-tech-record.model';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { State, initialAppState } from '@store/index';
import { generateADRCertificate } from '@store/technical-records';
import { ReplaySubject, of } from 'rxjs';
import { ContingencyAdrGenerateCertComponent } from '../contingency-adr-generate-cert.component';

const mockRecord = {
	systemNumber: 'sysNum',
	createdTimestamp: 'now',
	techRecord_statusCode: 'current',
	techRecord_adrPassCertificateDetails: [
		{
			createdByName: 'tester',
			certificateType: 'pass',
			generatedTimestamp: '2025-01-12T10:36:33.987Z',
			certificateId: '12345',
		},
		{
			createdByName: 'tester',
			certificateType: 'pass',
			generatedTimestamp: '2025-01-14T10:36:33.987Z',
			certificateId: '12345',
		},
	],
	techRecord_vehicleType: 'hgv',
	partialVin: '4321',
	vin: '87654321',
	techRecord_createdAt: 'now',
	techRecord_createdById: 'tester',
	techRecord_createdByName: 'tester',
	techRecord_reasonForCreation: 'test',
	techRecord_recordCompleteness: 'skeleton',
	techRecord_vehicleClass_description: 'heavy goods vehicle',
	techRecord_bodyType_description: 'box',
	primaryVrm: '12345',
} as unknown as V3TechRecordModel;

describe('AdrGenerateCertTestComponent', () => {
	let component: ContingencyAdrGenerateCertComponent;
	let fixture: ComponentFixture<ContingencyAdrGenerateCertComponent>;
	let store: Store<State>;
	let techRecordService: TechnicalRecordService;
	const actions$: ReplaySubject<Action> = new ReplaySubject<Action>(1);
	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ContingencyAdrGenerateCertComponent],
			providers: [
				provideHttpClient(),
				provideHttpClientTesting(),
				provideMockStore({ initialState: initialAppState }),
				{ provide: ActivatedRoute, useValue: { params: of([{ id: 1 }]) } },
				provideMockActions(() => actions$),
				TechnicalRecordService,
			],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		}).compileComponents();
	});
	beforeEach(() => {
		fixture = TestBed.createComponent(ContingencyAdrGenerateCertComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
		store = TestBed.inject(Store);
		techRecordService = TestBed.inject(TechnicalRecordService);
		fixture = TestBed.createComponent(ContingencyAdrGenerateCertComponent);
		component = fixture.componentInstance;
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('lastCertificateDate', () => {
		it('should return the most recent certificate date generation date', () => {
			techRecordService.techRecord$ = of(mockRecord);
			expect(component.lastCertificateDate).toBe('An ADR certificate was last generated on 14/01/2025');
		});
		it('should return a default string if there are no ADR certificates on a record', () => {
			const newMock = { ...mockRecord, techRecord_adrPassCertificateDetails: [] };
			techRecordService.techRecord$ = of(newMock);
			expect(component.lastCertificateDate).toBe('There are no previous ADR certificates for this vehicle');
		});
	});

	describe('documentParams', () => {
		it('should return a map in correct format', () => {
			expect(component.documentParams('testFileName')).toEqual(new Map([['fileName', 'testFileName']]));
		});
	});

	describe('handleSubmit', () => {
		beforeEach(() => {
			techRecordService.techRecord$ = of(mockRecord);
		});
		it('should dispatch the correct action with correct params', () => {
			const dispatchSpy = jest.spyOn(store, 'dispatch');
			component.ngOnInit();
			component.handleSubmit();

			expect(dispatchSpy).toHaveBeenCalled();
			expect(dispatchSpy).toHaveBeenCalledWith(
				generateADRCertificate({
					systemNumber: 'sysNum',
					createdTimestamp: 'now',
					certificateType: 'PASS',
				})
			);
		});
	});
});
