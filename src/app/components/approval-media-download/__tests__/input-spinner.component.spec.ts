import { GlobalErrorService } from '@/src/app/core/components/global-error/global-error.service';
import { RootRoutes } from '@/src/app/models/routes.enum';
import { DocumentsService } from '@/src/app/services/documents/documents.service';
import { HttpService } from '@/src/app/services/http/http.service';
import { initialAppState } from '@/src/app/store';
import { HttpErrorResponse, HttpEvent, HttpEventType, HttpStatusCode, provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { MediaSchema, TestResultSchema } from '@dvsa/cvs-type-definitions/types/v1/test-result';
import { provideMockStore } from '@ngrx/store/testing';
import { of, throwError } from 'rxjs';
import { ApprovalMediaDownloadComponent } from '../approval-media-download.component';

describe('MediaDownloadComponent', () => {
	let component: ApprovalMediaDownloadComponent;
	let fixture: ComponentFixture<ApprovalMediaDownloadComponent>;
	let router: Router;
	let httpService: HttpService;
	let globalErrorService: GlobalErrorService;
	let documentService: DocumentsService;

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

	describe('viewMediaApplicable', () => {
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
		it('should call openDocumentFromResponse upon receiving a 200 response', () => {
			vi
				.spyOn(httpService, 'getTestResultMedia')
				.mockReturnValue(of({ type: HttpEventType.Response } as HttpEvent<string>));

			const openDocumentFromResponseSpy = vi.spyOn(documentService, 'openDocumentFromResponse');
			component.downloadMedia({} as TestResultSchema);
			expect(openDocumentFromResponseSpy).toHaveBeenCalledTimes(1);
		});

		it('should call setErrors upon receiving a 404 response', () => {
			vi
				.spyOn(httpService, 'getTestResultMedia')
				.mockReturnValue(throwError(() => new HttpErrorResponse({ status: HttpStatusCode.NotFound })));

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
			vi
				.spyOn(httpService, 'getTestResultMedia')
				.mockReturnValue(throwError(() => new HttpErrorResponse({ status: HttpStatusCode.InternalServerError })));

			const navigateSpy = vi.spyOn(router, 'navigate');
			component.downloadMedia({} as TestResultSchema);
			expect(navigateSpy).toHaveBeenCalledWith([RootRoutes.ERROR]);
		});
	});
});
