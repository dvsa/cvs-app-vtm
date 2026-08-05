import { HttpClient, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { DocumentsService } from '@services/documents/documents.service';
import JSZip from 'jszip';
import { of } from 'rxjs';
import { FeatureToggleService } from '../../feature-toggle-service/feature-toggle-service';
import { DefectMediaService } from '../defect-media-service.service';

describe('DefectMediaService', () => {
	let service: DefectMediaService;

	let httpMock: jest.Mocked<HttpClient>;
	let documentsServiceMock: jest.Mocked<DocumentsService>;
	let globalErrorServiceMock: jest.Mocked<GlobalErrorService>;
	let featureToggleServiceMock: jest.Mocked<FeatureToggleService>;
	let routerMock: jest.Mocked<Router>;

	const mockTestResult: any = {
		testResultId: '123',
		testTypes: [
			{
				testTypeEndTimestamp: new Date().toISOString(),
				defects: [],
			},
		],
	};

	const mockDefect: any = {
		imNumber: 29,
		imDescription: 'Test defect',
		deficiencyCategory: 'dangerous',
		media: [{ path: 'file1.jpg', type: 'image' }],
	};

	beforeEach(() => {
		httpMock = {
			get: jest.fn(),
		} as any;

		documentsServiceMock = {
			createFileLink: jest.fn().mockReturnValue(document.createElement('a')),
			simulateClick: jest.fn(),
		} as any;

		globalErrorServiceMock = {
			setErrors: jest.fn(),
		} as any;

		featureToggleServiceMock = {
			isFeatureEnabled: jest.fn(),
		} as any;

		routerMock = {
			navigate: jest.fn(),
		} as any;

		TestBed.configureTestingModule({
			providers: [
				DefectMediaService,
				{ provide: HttpClient, useValue: httpMock },
				{ provide: DocumentsService, useValue: documentsServiceMock },
				{ provide: GlobalErrorService, useValue: globalErrorServiceMock },
				{ provide: FeatureToggleService, useValue: featureToggleServiceMock },
				{ provide: Router, useValue: routerMock },
			],
		});

		service = TestBed.inject(DefectMediaService);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	// =============================
	// Basic helpers
	// =============================

	it('should detect media correctly', () => {
		expect(service.hasMedia(mockDefect)).toBe(true);
		expect(service.hasMedia({ ...mockDefect, media: [] })).toBe(false);
	});

	it('should allow ADAS media when feature enabled and IM number is 29', () => {
		featureToggleServiceMock.isFeatureEnabled.mockReturnValue(true);
		expect(service.canDownloadAdasMediaItems(mockDefect)).toBe(true);
	});

	it('should block ADAS media when feature disabled', () => {
		featureToggleServiceMock.isFeatureEnabled.mockReturnValue(false);
		expect(service.canDownloadAdasMediaItems(mockDefect)).toBe(false);
	});

	it('should allow defect media when dangerous', () => {
		expect(service.canDownloadDefectMediaItems(mockDefect)).toBe(true);
	});

	it('should block media download when retention expired', () => {
		const oldDate = new Date();
		oldDate.setMonth(oldDate.getMonth() - 16);

		const result = {
			...mockTestResult,
			testTypes: [
				{
					...mockTestResult.testTypes[0],
					testTypeEndTimestamp: oldDate.toISOString(),
				},
			],
		};

		expect(service.hasRententionPeriodExpired(result)).toBe(true);
		expect(service.canDownloadMedia(result)).toBe(false);
	});

	// =============================
	// HTTP + ZIP
	// =============================

	it('should fetch presigned URL', async () => {
		httpMock.get.mockReturnValue(of('signed-url'));

		const result = await service.getPresignedUrl('123', { category: 'defects' });
		expect(result).toBe('signed-url');
	});

	it('should fetch blob', async () => {
		httpMock.get.mockReturnValueOnce(of('signed-url')).mockReturnValueOnce(of(new Blob(['data'])));

		const blob = await service.getBlob('123', { category: 'defects' });
		expect(blob).toBeInstanceOf(Blob);
	});

	it('should cache ZIP after first fetch', async () => {
		const jszipSpy = jest.spyOn(JSZip.prototype, 'loadAsync');
		jszipSpy.mockResolvedValue(new JSZip());

		httpMock.get.mockReturnValueOnce(of('signed-url')).mockReturnValueOnce(of(new Blob(['zip'])));

		const zip1 = await service.getZip('123', { category: 'defects' });
		const zip2 = await service.getZip('123', { category: 'defects' });

		expect(zip1).toBe(zip2);
		expect(jszipSpy).toHaveBeenCalledTimes(1);
	});

	// =============================
	// Media loading
	// =============================

	it('should return cached file if available', async () => {
		service.fileCache['file1.jpg'] = 'cached';

		const result = await service.loadMediaItemAsBase64(mockTestResult, mockDefect, { path: 'file1.jpg' } as any);

		expect(result).toBe('cached');
	});

	it('should return empty string if file not found', async () => {
		jest.spyOn(service, 'getDefectZip').mockResolvedValue(new JSZip());

		const result = await service.loadMediaItemAsBase64(mockTestResult, mockDefect, { path: 'missing.jpg' } as any);

		expect(result).toBe('');
	});

	// =============================
	// Download
	// =============================

	it('should download media and trigger document opening', async () => {
		const zip = new JSZip();
		jest.spyOn(service, 'canDownloadDefectMedia').mockReturnValue(true);
		jest.spyOn(service, 'getDefectZip').mockResolvedValue(zip);
		jest.spyOn(service, 'getAdasZip').mockResolvedValue(null);
		const openSpy = jest.spyOn(service, 'openDocumentFromZip').mockResolvedValue();

		await service.downloadMedia(mockTestResult);

		expect(openSpy).toHaveBeenCalled();
	});

	it('should handle download errors', async () => {
		jest.spyOn(service, 'canDownloadDefectMedia').mockReturnValue(true);
		jest.spyOn(service, 'getDefectZip').mockRejectedValue(new Error('fail'));

		const handleSpy = jest.spyOn(service, 'handleError');

		await service.downloadMedia(mockTestResult);

		expect(handleSpy).toHaveBeenCalled();
	});

	// =============================
	// Error handling
	// =============================

	it('should handle 404 error', () => {
		const error = new HttpErrorResponse({ status: HttpStatusCode.NotFound });

		service.handleError(error, 'test-result-123');

		expect(globalErrorServiceMock.setErrors).toHaveBeenCalled();
		expect(service.getMediaFetchError('test-result-123')).toEqual({
			status: HttpStatusCode.NotFound,
			message: 'Media could not be found',
		});
	});

	it('should navigate on 500 error', () => {
		const error = new HttpErrorResponse({ status: HttpStatusCode.InternalServerError });

		service.handleError(error, 'test-result-123');

		expect(routerMock.navigate).toHaveBeenCalled();
		expect(service.getMediaFetchError('test-result-123')).toEqual({
			status: HttpStatusCode.InternalServerError,
			message: 'Media could not be downloaded',
		});
	});

	it('should handle error without testResultId for backward compatibility', () => {
		const error = new HttpErrorResponse({ status: HttpStatusCode.NotFound });

		service.handleError(error);

		expect(globalErrorServiceMock.setErrors).toHaveBeenCalled();
	});
});
