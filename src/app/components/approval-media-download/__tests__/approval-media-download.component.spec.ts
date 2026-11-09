import { GlobalErrorService } from '@/src/app/core/components/global-error/global-error.service';
import { RootRoutes } from '@/src/app/models/routes.enum';
import { VehicleSubclass } from '@/src/app/models/vehicle-tech-record.model';
import { DocumentsService } from '@/src/app/services/documents/documents.service';
import { HttpService } from '@/src/app/services/http/http.service';
import { initialAppState } from '@/src/app/store';
import { HttpErrorResponse, HttpEvent, HttpEventType, HttpStatusCode, provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { VehicleType } from '@dvsa/cvs-type-definitions/types/v1/enums/vehicleType.enum.js';
import { MediaSchema, TestResultSchema } from '@dvsa/cvs-type-definitions/types/v1/test-result';
import { EUVehicleCategory } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/euVehicleCategory.enum.js';
import { mockTestResult } from '@mocks/mock-test-result';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { selectedTestResultState } from '@store/test-records';
import { of, throwError } from 'rxjs';
import { ApprovalMediaDownloadComponent } from '../approval-media-download.component';

describe('ApprovalMediaDownloadComponent', () => {
	let component: ApprovalMediaDownloadComponent;
	let fixture: ComponentFixture<ApprovalMediaDownloadComponent>;
	let router: Router;
	let httpService: HttpService;
	let globalErrorService: GlobalErrorService;
	let documentService: DocumentsService;
	let store: MockStore;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ApprovalMediaDownloadComponent],
			providers: [
				provideMockStore({ initialState: initialAppState }),
				provideHttpClient(),
				provideHttpClientTesting(),
				provideRouter([{ path: RootRoutes.ERROR, component: vi.fn() }]),
				{ provide: HttpService, useValue: { getTestResultMedia: vi.fn() } },
				{ provide: GlobalErrorService, useValue: { clearErrors: vi.fn(), setErrors: vi.fn() } },
				{ provide: DocumentsService, useValue: { openDocumentFromResponse: vi.fn() } },
			],
		}).compileComponents();

		store = TestBed.inject(MockStore);
		store.overrideSelector(selectedTestResultState, mockTestResult());
		fixture = TestBed.createComponent(ApprovalMediaDownloadComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();

		router = TestBed.inject(Router);
		httpService = TestBed.inject(HttpService);
		globalErrorService = TestBed.inject(GlobalErrorService);
		documentService = TestBed.inject(DocumentsService);
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('media retention rules', () => {
		it.each([
			[VehicleType.MOTORCYCLE, undefined, 5],
			[VehicleType.TRL, EUVehicleCategory.O1, 5],
			[VehicleType.TRL, EUVehicleCategory.O4, 5],
			[VehicleType.HGV, EUVehicleCategory.N2, 5],
			[VehicleType.HGV, EUVehicleCategory.N3, 5],
			[VehicleType.PSV, EUVehicleCategory.M2, 10],
			[VehicleType.PSV, EUVehicleCategory.M3, 10],
		] as const)('retains %s / %s media for %s years', (vehicleType, euVehicleCategory, years) => {
			expect(component.getMediaRetentionPeriod({ vehicleType, euVehicleCategory } as TestResultSchema)).toBe(years);
		});

		it.each([EUVehicleCategory.M1, EUVehicleCategory.N1])(
			'retains %s media for five years without subclasses',
			(euVehicleCategory) => {
				for (const vehicleSubclass of [undefined, []]) {
					expect(component.getMediaRetentionPeriod({ euVehicleCategory, vehicleSubclass } as TestResultSchema)).toBe(5);
				}
			}
		);

		it.each([EUVehicleCategory.M1, EUVehicleCategory.N1])(
			'retains category 1 %s media for twenty years',
			(euVehicleCategory) => {
				for (const vehicleSubclass of [
					[VehicleSubclass.A],
					[VehicleSubclass.C],
					[VehicleSubclass.S],
					[VehicleSubclass.L],
					[VehicleSubclass.A, VehicleSubclass.C, VehicleSubclass.S, VehicleSubclass.L],
				]) {
					expect(component.getMediaRetentionPeriod({ euVehicleCategory, vehicleSubclass } as TestResultSchema)).toBe(
						20
					);
				}
			}
		);

		it.each([
			[EUVehicleCategory.M1, [VehicleSubclass.P, VehicleSubclass.M, VehicleSubclass.N]],
			[EUVehicleCategory.N1, [VehicleSubclass.P, VehicleSubclass.N]],
		] as const)('retains category 2 %s media for ten years', (euVehicleCategory, vehicleSubclass) => {
			expect(component.getMediaRetentionPeriod({ euVehicleCategory, vehicleSubclass } as TestResultSchema)).toBe(10);
		});

		it('retains category 3 N1 media for five years', () => {
			expect(
				component.getMediaRetentionPeriod({
					euVehicleCategory: EUVehicleCategory.N1,
					vehicleSubclass: [VehicleSubclass.R],
				} as TestResultSchema)
			).toBe(5);
		});

		it.each([
			[EUVehicleCategory.N1, [VehicleSubclass.M]],
			[EUVehicleCategory.M1, [VehicleSubclass.A, VehicleSubclass.P]],
			[EUVehicleCategory.N1, [VehicleSubclass.A, VehicleSubclass.R]],
			[undefined, undefined],
		] as const)(
			'does not impose a retention deadline on an unclassified combination (%s / %s)',
			(euVehicleCategory, vehicleSubclass) => {
				expect(component.getMediaRetentionPeriod({ euVehicleCategory, vehicleSubclass } as TestResultSchema)).toBe(
					Number.POSITIVE_INFINITY
				);
			}
		);
	});

	describe('retention expiry', () => {
		beforeEach(() => {
			vi.useFakeTimers();
			vi.setSystemTime(new Date('2026-11-09T12:00:00Z'));
		});

		it.each([
			['2021-11-09T12:00:00.001Z', false],
			['2021-11-09T12:00:00.000Z', true],
			['2021-11-09T11:59:59.999Z', true],
		] as const)('checks the exact five-year boundary for %s', (testTypeEndTimestamp, expired) => {
			const test = { vehicleType: VehicleType.MOTORCYCLE, testTypes: [{ testTypeEndTimestamp }] } as TestResultSchema;
			expect(component.hasMediaRetentionPeriodExpired(test)).toBe(expired);
		});

		it.each([undefined, '', 'not-a-date'])(
			'does not expire media with an invalid end date (%s)',
			(testTypeEndTimestamp) => {
				expect(
					component.hasMediaRetentionPeriodExpired({
						vehicleType: VehicleType.MOTORCYCLE,
						testTypes: [{ testTypeEndTimestamp }],
					} as TestResultSchema)
				).toBe(false);
			}
		);

		it('does not expire media when test types are missing', () => {
			expect(component.hasMediaRetentionPeriodExpired({} as TestResultSchema)).toBe(false);
		});

		it('uses the twenty-year retention rule for category 1 vehicles', () => {
			const test = {
				euVehicleCategory: EUVehicleCategory.M1,
				vehicleSubclass: [VehicleSubclass.A],
				testTypes: [{ testTypeEndTimestamp: '2010-11-09T12:00:00Z' }],
			} as TestResultSchema;
			expect(component.hasMediaRetentionPeriodExpired(test)).toBe(false);
			vi.setSystemTime(new Date('2030-11-09T12:00:00Z'));
			expect(component.hasMediaRetentionPeriodExpired(test)).toBe(true);
		});

		it('does not expire unclassified media even for old tests', () => {
			expect(
				component.hasMediaRetentionPeriodExpired({
					testTypes: [{ testTypeEndTimestamp: '2000-01-01T00:00:00Z' }],
				} as TestResultSchema)
			).toBe(false);
		});
	});

	describe('rendered media availability', () => {
		beforeEach(() => {
			vi.useFakeTimers();
			vi.setSystemTime(new Date('2026-11-09T12:00:00Z'));
		});

		function renderTest(testTypeEndTimestamp: string, media: MediaSchema[]) {
			store.overrideSelector(selectedTestResultState, {
				...mockTestResult(),
				vehicleType: VehicleType.MOTORCYCLE,
				media,
				testTypes: [{ testTypeId: '153', testTypeEndTimestamp }],
			} as TestResultSchema);
			store.refreshState();
			fixture.detectChanges();
		}

		it('allows downloading media within its retention period', () => {
			renderTest('2025-11-09T12:00:00Z', [{ type: 'image', path: 'photo.jpg' }]);
			const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
			expect(button.textContent).toContain('Download media');
			const download = vi.spyOn(component, 'downloadMedia').mockImplementation(() => {});
			button.click();
			expect(download).toHaveBeenCalledExactlyOnceWith(component.testResult());
		});

		it('replaces the download button with an explanation once media has expired', () => {
			renderTest('2021-11-09T12:00:00Z', [{ type: 'image', path: 'photo.jpg' }]);
			expect(fixture.nativeElement.querySelector('button')).toBeNull();
			expect(fixture.nativeElement.textContent).toContain('media was deleted as the retention period had passed');
		});

		it('shows the recorded failure reason when no downloadable media was captured', () => {
			renderTest('2025-11-09T12:00:00Z', [{ type: 'failReason', reason: 'Camera unavailable', path: ' ' }]);
			expect(fixture.nativeElement.querySelector('button')).toBeNull();
			expect(fixture.nativeElement.querySelector('#media-failure-to-capture-reason').textContent).toContain(
				'No media available - Camera unavailable'
			);
		});
	});

	describe('viewMediaApplicable', () => {
		it('includes specialist group 5 tests', () => {
			expect(component.viewMediaApplicable({ testTypes: [{ testTypeId: '153' }] } as TestResultSchema)).toBe(true);
		});
		it('should return false if the testResultId is not an approvals test', () => {
			const testResult = {
				media: [{ type: 'image', path: '/foo/bar.zip' }],
				testTypes: [{ testTypeId: 'bar' }],
			} as TestResultSchema;

			expect(component.viewMediaApplicable(testResult)).toBe(false);
		});

		it('should return true if the testResultId is an approvals test', () => {
			const testResult = {
				media: [{ type: 'image', path: '/foo/bar.zip' }],
				testTypes: [{ testTypeId: '130' }],
			} as TestResultSchema;
			expect(component.viewMediaApplicable(testResult)).toBe(true);
		});
	});

	describe('canDownloadApprovalsMedia', () => {
		it('should return false if the testResult media array is undefined', () => {
			const testResult = { media: undefined } as TestResultSchema;
			expect(component.canDownloadApprovalsMedia(testResult)).toBe(false);
		});
		it('should return false if the testResult media array contains only failReasons', () => {
			const testResult = {
				media: [
					{ type: 'failReason', reason: 'foo' },
					{ type: 'failReason', reason: 'bar' },
				],
			} as TestResultSchema;
			expect(component.canDownloadApprovalsMedia(testResult)).toBe(false);
		});

		it('should return true if the testResult media array contains only images or videos', () => {
			const testResult = {
				media: [
					{ type: 'image', path: '/foo/bar1.zip' },
					{ type: 'video', path: '/foo/bar2.zip' },
				],
			} as TestResultSchema;
			expect(component.canDownloadApprovalsMedia(testResult)).toBe(true);
		});
	});

	describe('getFailureToCaptureApprovalsMediaReason', () => {
		it('should return an empty string if the testResult media array is undefined', () => {
			const testResult = { media: undefined } as TestResultSchema;
			expect(component.getFailureToCaptureApprovalsMediaReason(testResult)).toBe('No media available');
		});

		it('should return the first failReason if the testResult media array contains only failReasons', () => {
			const testResult = {
				media: [
					{ type: 'failReason', reason: 'foo' },
					{ type: 'failReason', reason: 'bar' },
				],
			} as TestResultSchema;
			expect(component.getFailureToCaptureApprovalsMediaReason(testResult)).toBe('No media available - foo');
		});

		it('should return a default reason if the testResult media array is empty', () => {
			const testResult = {
				media: [] as MediaSchema[],
			} as TestResultSchema;
			expect(component.getFailureToCaptureApprovalsMediaReason(testResult)).toBe(
				'Reason for failure to capture media not available'
			);
		});
	});

	describe('ngOnDestroy', () => {
		it('should call clearErrors', () => {
			const clearErrorsSpy = vi.spyOn(globalErrorService, 'clearErrors');
			component.ngOnDestroy();
			expect(clearErrorsSpy).toHaveBeenCalledTimes(1);
		});
	});

	describe('downloadMedia', () => {
		it('requests approval media with the result ID and opens only the completed zip', () => {
			const test = { testResultId: 'result-1' } as TestResultSchema;
			vi.spyOn(httpService, 'getTestResultMedia').mockReturnValue(
				of(
					{ type: HttpEventType.Sent } as HttpEvent<string>,
					{ type: HttpEventType.DownloadProgress, loaded: 50 } as HttpEvent<string>,
					{ type: HttpEventType.Response, body: 'signed-url' } as HttpEvent<string>
				)
			);

			component.downloadMedia(test);

			expect(httpService.getTestResultMedia).toHaveBeenCalledWith('result-1', new Map([['category', 'approvals']]));
			expect(documentService.openDocumentFromResponse).toHaveBeenCalledExactlyOnceWith(
				'result-1.zip',
				'signed-url',
				'zip'
			);
		});

		it('reports unexpected HTTP errors for monitoring', () => {
			const error = new HttpErrorResponse({ status: HttpStatusCode.Forbidden });
			vi.spyOn(httpService, 'getTestResultMedia').mockReturnValue(throwError(() => error));
			const logError = vi.spyOn(console, 'error').mockImplementation(() => {});
			try {
				component.downloadMedia({ testResultId: 'result-1' } as TestResultSchema);
				expect(logError).toHaveBeenCalledExactlyOnceWith(error);
				expect(documentService.openDocumentFromResponse).not.toHaveBeenCalled();
				expect(globalErrorService.setErrors).not.toHaveBeenCalled();
			} finally {
				logError.mockRestore();
			}
		});
		it('should call openDocumentFromResponse upon receiving a 200 response', () => {
			vi.spyOn(httpService, 'getTestResultMedia').mockReturnValue(
				of({ type: HttpEventType.Response } as HttpEvent<string>)
			);

			const openDocumentFromResponseSpy = vi.spyOn(documentService, 'openDocumentFromResponse');
			component.downloadMedia({} as TestResultSchema);
			expect(openDocumentFromResponseSpy).toHaveBeenCalledTimes(1);
		});

		it('should call setErrors upon receiving a 404 response', () => {
			vi.spyOn(httpService, 'getTestResultMedia').mockReturnValue(
				throwError(() => new HttpErrorResponse({ status: HttpStatusCode.NotFound }))
			);

			const setErrorsSpy = vi.spyOn(globalErrorService, 'setErrors');
			component.downloadMedia({} as TestResultSchema);
			expect(setErrorsSpy).toHaveBeenCalledWith([
				{
					error:
						'Media could not be found. <br>Try again later or contact the service desk if this issue keeps happening.',
					anchorLink: '',
				},
			]);
		});

		it('should redirect to error page upon receiving a 500 response', () => {
			vi.spyOn(httpService, 'getTestResultMedia').mockReturnValue(
				throwError(() => new HttpErrorResponse({ status: HttpStatusCode.InternalServerError }))
			);

			const navigateSpy = vi.spyOn(router, 'navigate');
			component.downloadMedia({} as TestResultSchema);
			expect(navigateSpy).toHaveBeenCalledWith([RootRoutes.ERROR]);
		});
	});
});
