import { UserService } from '@/src/app/services/user-service/user-service';
import { ViewportScroller } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { ADRCertificateDetails } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/hgv/complete';
import { TechRecordGETHGV } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb-vehicle-type';
import { AdrCertsSectionViewComponent } from '@forms/custom-sections/adr-certs-section/adr-certs-section-view/adr-certs-section-view.component';
import { createMockHgv } from '@mocks/hgv-record.mock';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { AdrService } from '@services/adr/adr.service';
import { State, initialAppState } from '@store/index';
import { techRecord } from '@store/technical-records';
import { of } from 'rxjs';

describe('AdrCertsSectionViewComponent', () => {
	let component: AdrCertsSectionViewComponent;
	let fixture: ComponentFixture<AdrCertsSectionViewComponent>;
	let globalErrorService: GlobalErrorService;
	let adrService: AdrService;
	let router: Router;
	let viewportScroller: ViewportScroller;
	let store: MockStore<State>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			providers: [
				provideRouter([]),
				provideHttpClient(),
				provideHttpClientTesting(),
				provideMockStore({ initialState: initialAppState }),
				{ provide: UserService, useValue: { roles$: of(['TechRecord.View']) } },
			],
			imports: [AdrCertsSectionViewComponent],
			schemas: [NO_ERRORS_SCHEMA],
		}).compileComponents();
	});
	beforeEach(() => {
		fixture = TestBed.createComponent(AdrCertsSectionViewComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
		globalErrorService = TestBed.inject(GlobalErrorService);
		adrService = TestBed.inject(AdrService);
		router = TestBed.inject(Router);
		viewportScroller = TestBed.inject(ViewportScroller);
		store = TestBed.inject(MockStore);
		store.overrideSelector(techRecord, createMockHgv(0) as TechRecordGETHGV);
		store.refreshState();
	});
	it('should create', () => {
		expect(component).toBeTruthy();
	});
	describe('showTable', () => {
		it('should return false if isEditing returns true', () => {
			jest.spyOn(component, 'numberOfADRCertificates', 'get').mockReturnValue(0);
			expect(component.showTable()).toBe(false);
		});
		it('should return false if numberOfADRCertificates returns 0', () => {
			const mockTechRecord = createMockHgv(0);
			mockTechRecord.techRecord_adrPassCertificateDetails = [];
			store.overrideSelector(techRecord, mockTechRecord as TechRecordGETHGV);
			store.refreshState();
			expect(component.showTable()).toBe(false);
		});
		it('should return true if numberOfADRCertificates returns > 0', () => {
			jest.spyOn(component, 'numberOfADRCertificates', 'get').mockReturnValue(1);
			const mockTechRecord = createMockHgv(0);
			mockTechRecord.techRecord_adrPassCertificateDetails = [
				{
					createdByName: '',
					certificateType: 'PASS',
					generatedTimestamp: '',
					certificateId: '',
				} as unknown as ADRCertificateDetails,
			];
			store.overrideSelector(techRecord, mockTechRecord as TechRecordGETHGV);
			store.refreshState();

			expect(component.showTable()).toBe(true);
		});
	});

	describe('validateADRDetailsAndNavigate', () => {
		it('should navigate when carriesDangerousGoodsSpy returns true', () => {
			const clearErrorsSpy = jest.spyOn(globalErrorService, 'clearErrors');
			const carriesDangerousGoodsSpy = jest.spyOn(adrService, 'carriesDangerousGoods');
			const routerSpy = jest.spyOn(router, 'navigate');

			const mockTechRecord = createMockHgv(0);
			mockTechRecord.techRecord_adrDetails_dangerousGoods = true;
			store.overrideSelector(techRecord, mockTechRecord as TechRecordGETHGV);
			store.refreshState();

			component.validateADRDetailsAndNavigate();

			expect(clearErrorsSpy).toHaveBeenCalled();
			expect(carriesDangerousGoodsSpy).toHaveBeenCalled();
			expect(routerSpy).toHaveBeenCalled();
		});
		it('should not navigate when carriesDangerousGoods returns false', () => {
			const clearErrorsSpy = jest.spyOn(globalErrorService, 'clearErrors');
			const addErrorSpy = jest.spyOn(globalErrorService, 'addError');
			const carriesDangerousGoodsSpy = jest.spyOn(adrService, 'carriesDangerousGoods');
			const routerSpy = jest.spyOn(router, 'navigate');
			const viewportScrollerSpy = jest.spyOn(viewportScroller, 'scrollToPosition').mockImplementation(() => {});

			const mockTechRecord = createMockHgv(0);
			mockTechRecord.techRecord_adrDetails_dangerousGoods = false;
			store.overrideSelector(techRecord, mockTechRecord as TechRecordGETHGV);
			store.refreshState();

			component.validateADRDetailsAndNavigate();

			expect(clearErrorsSpy).toHaveBeenCalled();
			expect(carriesDangerousGoodsSpy).toHaveBeenCalled();
			expect(viewportScrollerSpy).toHaveBeenCalled();
			expect(addErrorSpy).toHaveBeenCalled();
			expect(routerSpy).not.toHaveBeenCalled();
		});
	});

	describe('handlePaginationChange', () => {
		it('should do an early return if there is no event', () => {
			component.pageStart = 0;
			component.pageEnd = 0;
			const event = undefined;

			component.handlePaginationChange(event);
			expect(component.pageStart).toEqual(0);
			expect(component.pageEnd).toEqual(0);
		});

		it('should reassign the components pageStart and pageEnd variables from the event', () => {
			component.pageStart = 0;
			component.pageEnd = 0;
			const event = { start: 5, end: 6 };

			component.handlePaginationChange(event);

			expect(component.pageStart).toEqual(5);
			expect(component.pageEnd).toEqual(6);
		});
	});

	describe('getFileName', () => {
		it('should do an early return if there is no event', () => {
			const adrCertDetails = {
				certificateId: '12345',
				certificateType: 'pass',
				createdByName: 'me',
				generatedTimestamp: 'now',
			} as unknown as ADRCertificateDetails;

			const result = component.getFileName(adrCertDetails);

			expect(result).toEqual(adrCertDetails.certificateId);
		});
	});

	describe('documentParams', () => {
		it('should do an early return if there is no event', () => {
			const adrCertDetails = {
				certificateId: '12345',
				certificateType: 'pass',
				createdByName: 'me',
				generatedTimestamp: 'now',
			} as unknown as ADRCertificateDetails;

			const result = component.documentParams(adrCertDetails);

			expect(result).toBeInstanceOf(Map);
			expect(result.size).toBe(1);
			expect(result.get('fileName')).toBe(adrCertDetails.certificateId);
		});
	});
});
