import { UserService } from '@/src/app/services/user-service/user-service';
import { ViewportScroller } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { ADRCertificateDetails } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/hgv/complete';
import { createMockHgv } from '@mocks/hgv-record.mock';
import { provideMockStore } from '@ngrx/store/testing';
import { AdrService } from '@services/adr/adr.service';
import { initialAppState } from '@store/index';
import { of } from 'rxjs';
import { AdrCertificateHistoryComponent } from '../adr-certificate-history.component';

describe('TechRecordAdrCertificateHistoryComponent', () => {
	let component: AdrCertificateHistoryComponent;
	let fixture: ComponentFixture<AdrCertificateHistoryComponent>;
	let globalErrorService: GlobalErrorService;
	let adrService: AdrService;
	let router: Router;
	let viewportScroller: ViewportScroller;
	beforeEach(async () => {
		await TestBed.configureTestingModule({
			providers: [
				provideRouter([]),
				provideHttpClient(),
				provideHttpClientTesting(),
				provideMockStore({ initialState: initialAppState }),
				{ provide: UserService, useValue: { roles$: of(['TechRecord.View']) } },
			],
			imports: [AdrCertificateHistoryComponent],
			schemas: [NO_ERRORS_SCHEMA],
		}).compileComponents();
	});
	beforeEach(() => {
		fixture = TestBed.createComponent(AdrCertificateHistoryComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
		fixture.componentRef.setInput('currentTechRecord', createMockHgv(0));
		globalErrorService = TestBed.inject(GlobalErrorService);
		adrService = TestBed.inject(AdrService);
		router = TestBed.inject(Router);
		viewportScroller = TestBed.inject(ViewportScroller);
	});
	it('should create', () => {
		expect(component).toBeTruthy();
	});
	describe('showTable', () => {
		it('should return false if isEditing returns true', () => {
			component.isEditing = true;
			expect(component.showTable()).toBe(false);
		});
		it('should return false if numberOfADRCertificates returns 0', () => {
			const mockTechRecord = createMockHgv(0);
			mockTechRecord.techRecord_adrPassCertificateDetails = [];
			fixture.componentRef.setInput('currentTechRecord', mockTechRecord);
			component.isEditing = false;
			expect(component.showTable()).toBe(false);
		});
		it('should return true if numberOfADRCertificates returns > 0', () => {
			const mockTechRecord = createMockHgv(0);
			mockTechRecord.techRecord_adrPassCertificateDetails = [
				{
					createdByName: '',
					certificateType: 'PASS',
					generatedTimestamp: '',
					certificateId: '',
				} as unknown as ADRCertificateDetails,
			];
			fixture.componentRef.setInput('currentTechRecord', mockTechRecord);

			expect(component.showTable()).toBe(true);
		});
	});

	describe('validateADRDetailsAndNavigate', () => {
		it('should navigate when carriesDangerousGoodsSpy returns true', () => {
			fixture.ngZone?.run(() => {
				const mockTechRecord = createMockHgv(0);
				mockTechRecord.techRecord_adrDetails_dangerousGoods = true;
				fixture.componentRef.setInput('currentTechRecord', mockTechRecord);
				const clearErrorsSpy = jest.spyOn(globalErrorService, 'clearErrors');
				const carriesDangerousGoodsSpy = jest.spyOn(adrService, 'carriesDangerousGoods');
				const routerSpy = jest.spyOn(router, 'navigate');
				component.validateADRDetailsAndNavigate();
				expect(clearErrorsSpy).toHaveBeenCalled();
				expect(carriesDangerousGoodsSpy).toHaveBeenCalled();
				expect(routerSpy).toHaveBeenCalled();
			});
		});
		it('should not navigate when carriesDangerousGoods returns false', () => {
			const mockTechRecord = createMockHgv(0);
			mockTechRecord.techRecord_adrDetails_dangerousGoods = false;
			fixture.componentRef.setInput('currentTechRecord', mockTechRecord);
			const clearErrorsSpy = jest.spyOn(globalErrorService, 'clearErrors');
			const addErrorSpy = jest.spyOn(globalErrorService, 'addError');
			const carriesDangerousGoodsSpy = jest.spyOn(adrService, 'carriesDangerousGoods');
			const routerSpy = jest.spyOn(router, 'navigate');
			const viewportScrollerSpy = jest.spyOn(viewportScroller, 'scrollToPosition').mockImplementation(() => {});
			component.validateADRDetailsAndNavigate();
			expect(clearErrorsSpy).toHaveBeenCalled();
			expect(carriesDangerousGoodsSpy).toHaveBeenCalled();
			expect(viewportScrollerSpy).toHaveBeenCalled();
			expect(addErrorSpy).toHaveBeenCalled();
			expect(routerSpy).not.toHaveBeenCalled();
		});
	});
});
