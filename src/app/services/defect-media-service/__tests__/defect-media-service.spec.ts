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

	let httpMock: Mocked<HttpClient>;
	let documentsServiceMock: Mocked<DocumentsService>;
	let globalErrorServiceMock: Mocked<GlobalErrorService>;
	let featureToggleServiceMock: Mocked<FeatureToggleService>;
	let routerMock: Mocked<Router>;

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
			get: vi.fn(),
		} as any;

		documentsServiceMock = {
			createFileLink: vi.fn().mockReturnValue(document.createElement('a')),
			simulateClick: vi.fn(),
		} as any;

		globalErrorServiceMock = {
			setErrors: vi.fn(),
		} as any;

		featureToggleServiceMock = {
			isFeatureEnabled: vi.fn(),
		} as any;

		routerMock = {
			navigate: vi.fn(),
		} as any;

		global.URL.createObjectURL = vi.fn().mockReturnValue('objectURL');

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
		vi.clearAllMocks();
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
		const jszipSpy = vi.spyOn(JSZip.prototype, 'loadAsync');
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
		vi.spyOn(service, 'getDefectZip').mockResolvedValue(new JSZip());

		const result = await service.loadMediaItemAsBase64(mockTestResult, mockDefect, { path: 'missing.jpg' } as any);

		expect(result).toBe('');
	});

	// =============================
	// Download
	// =============================

	it('should download media and trigger document opening', async () => {
		const zip = new JSZip();
		vi.spyOn(service, 'canDownloadDefectMedia').mockReturnValue(true);
		vi.spyOn(service, 'getDefectZip').mockResolvedValue(zip);
		vi.spyOn(service, 'getAdasZip').mockResolvedValue(null);
		const openSpy = vi.spyOn(service, 'openDocumentFromZip').mockResolvedValue();

		await service.downloadMedia(mockTestResult);

		expect(openSpy).toHaveBeenCalled();
	});

	it('should handle download errors', async () => {
		vi.spyOn(service, 'canDownloadDefectMedia').mockReturnValue(true);
		vi.spyOn(service, 'getDefectZip').mockRejectedValue(new Error('fail'));

		const handleSpy = vi.spyOn(service, 'handleError');

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

	it('should handle a 500 error without a testResultId', () => {
		const error = new HttpErrorResponse({ status: HttpStatusCode.InternalServerError });

		service.handleError(error);

		expect(routerMock.navigate).toHaveBeenCalledWith(['error']);
	});

	it('should log unhandled error statuses to the console without affecting global state', () => {
		const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
		const error = new HttpErrorResponse({ status: HttpStatusCode.BadRequest });

		service.handleError(error, 'test-result-123');

		expect(consoleSpy).toHaveBeenCalledWith(error);
		expect(globalErrorServiceMock.setErrors).not.toHaveBeenCalled();
		expect(routerMock.navigate).not.toHaveBeenCalled();
	});

	it('should ignore errors that are not HttpErrorResponse instances', () => {
		service.handleError(new Error('generic failure'), 'test-result-123');

		expect(globalErrorServiceMock.setErrors).not.toHaveBeenCalled();
		expect(routerMock.navigate).not.toHaveBeenCalled();
	});

	// =============================
	// Media helpers
	// =============================

	describe('hasMediaInCache', () => {
		it('should return false when the defect has no media', () => {
			expect(service.hasMediaInCache({ ...mockDefect, media: [] })).toBe(false);
		});

		it('should return false when none of the media items are cached', () => {
			expect(service.hasMediaInCache(mockDefect)).toBe(false);
		});

		it('should return true when a media item is cached', () => {
			service.fileCache['file1.jpg'] = 'cached';
			expect(service.hasMediaInCache(mockDefect)).toBe(true);
		});
	});

	describe('getImages / getVideos', () => {
		const mixedDefect: any = {
			...mockDefect,
			media: [
				{ path: 'a.jpg', type: 'image' },
				{ path: 'b.mp4', type: 'video' },
				{ path: 'c.pdf', type: 'failReason' },
			],
		};

		it('should return only image media items', () => {
			expect(service.getImages(mixedDefect)).toEqual([{ path: 'a.jpg', type: 'image' }]);
		});

		it('should return only video media items', () => {
			expect(service.getVideos(mixedDefect)).toEqual([{ path: 'b.mp4', type: 'video' }]);
		});

		it('should return an empty array when media is undefined', () => {
			expect(service.getImages({ ...mixedDefect, media: undefined })).toEqual([]);
			expect(service.getVideos({ ...mixedDefect, media: undefined })).toEqual([]);
		});
	});

	describe('canDownloadAdasMedia', () => {
		it('should return false when there are no defects', () => {
			featureToggleServiceMock.isFeatureEnabled.mockReturnValue(true);
			const result = { ...mockTestResult, testTypes: [{ ...mockTestResult.testTypes[0], defects: [] }] };
			expect(service.canDownloadAdasMedia(result)).toBe(false);
		});

		it('should return true when any defect is ADAS-downloadable', () => {
			featureToggleServiceMock.isFeatureEnabled.mockReturnValue(true);
			const result = { ...mockTestResult, testTypes: [{ ...mockTestResult.testTypes[0], defects: [mockDefect] }] };
			expect(service.canDownloadAdasMedia(result)).toBe(true);
		});

		it('should return false when defects is not an array', () => {
			featureToggleServiceMock.isFeatureEnabled.mockReturnValue(true);
			const result = { ...mockTestResult, testTypes: [{ ...mockTestResult.testTypes[0], defects: undefined }] };
			expect(service.canDownloadAdasMedia(result)).toBe(false);
		});
	});

	describe('canDownloadDefectMedia', () => {
		it('should return false when there are no defects', () => {
			const result = { ...mockTestResult, testTypes: [{ ...mockTestResult.testTypes[0], defects: [] }] };
			expect(service.canDownloadDefectMedia(result)).toBe(false);
		});

		it('should return true when any defect is dangerous with media', () => {
			const result = { ...mockTestResult, testTypes: [{ ...mockTestResult.testTypes[0], defects: [mockDefect] }] };
			expect(service.canDownloadDefectMedia(result)).toBe(true);
		});
	});

	describe('canDownloadMediaItems', () => {
		it('should return true when ADAS media is downloadable', () => {
			featureToggleServiceMock.isFeatureEnabled.mockReturnValue(true);
			expect(service.canDownloadMediaItems(mockDefect)).toBe(true);
		});

		it('should return true when defect media is downloadable', () => {
			featureToggleServiceMock.isFeatureEnabled.mockReturnValue(false);
			expect(service.canDownloadMediaItems(mockDefect)).toBe(true);
		});

		it('should return false when neither ADAS nor defect media is downloadable', () => {
			featureToggleServiceMock.isFeatureEnabled.mockReturnValue(false);
			expect(service.canDownloadMediaItems({ ...mockDefect, deficiencyCategory: 'minor' })).toBe(false);
		});
	});

	describe('canDownloadMedia', () => {
		it('should return true when ADAS media is downloadable and retention has not expired', () => {
			featureToggleServiceMock.isFeatureEnabled.mockReturnValue(true);
			const result = { ...mockTestResult, testTypes: [{ ...mockTestResult.testTypes[0], defects: [mockDefect] }] };
			expect(service.canDownloadMedia(result)).toBe(true);
		});

		it('should return true when defect media is downloadable and retention has not expired', () => {
			featureToggleServiceMock.isFeatureEnabled.mockReturnValue(false);
			const result = { ...mockTestResult, testTypes: [{ ...mockTestResult.testTypes[0], defects: [mockDefect] }] };
			expect(service.canDownloadMedia(result)).toBe(true);
		});
	});

	describe('zipContainsMediaItems', () => {
		it('should return false when the defect has no media', () => {
			const zip = new JSZip();
			expect(service.zipContainsMediaItems(zip, { ...mockDefect, media: [] })).toBe(false);
		});

		it('should return false when the zip does not contain any of the media files', () => {
			const zip = new JSZip();
			expect(service.zipContainsMediaItems(zip, mockDefect)).toBe(false);
		});

		it('should return true when the zip contains a matching media file', () => {
			const zip = new JSZip();
			zip.file('file1.jpg', 'contents');
			expect(service.zipContainsMediaItems(zip, mockDefect)).toBe(true);
		});
	});

	describe('mediaItemsExistInCache', () => {
		it('should return false when ADAS media is downloadable but no zip is cached', () => {
			featureToggleServiceMock.isFeatureEnabled.mockReturnValue(true);
			expect(service.mediaItemsExistInCache('123', mockDefect)).toBe(false);
		});

		it('should return true when ADAS media is downloadable and the cached zip contains the file', () => {
			featureToggleServiceMock.isFeatureEnabled.mockReturnValue(true);
			const zip = new JSZip();
			zip.file('file1.jpg', 'contents');
			service.zipCache[service.getZipCacheKey('123', { category: 'adas' })] = zip;

			expect(service.mediaItemsExistInCache('123', mockDefect)).toBe(true);
		});

		it('should return false when defect media is downloadable but no zip is cached', () => {
			featureToggleServiceMock.isFeatureEnabled.mockReturnValue(false);
			expect(service.mediaItemsExistInCache('123', mockDefect)).toBe(false);
		});

		it('should return true when defect media is downloadable and the cached zip contains the file', () => {
			featureToggleServiceMock.isFeatureEnabled.mockReturnValue(false);
			const zip = new JSZip();
			zip.file('file1.jpg', 'contents');
			service.zipCache[service.getZipCacheKey('123', { category: 'defects' })] = zip;

			expect(service.mediaItemsExistInCache('123', mockDefect)).toBe(true);
		});

		it('should return false when neither ADAS nor defect media is downloadable', () => {
			featureToggleServiceMock.isFeatureEnabled.mockReturnValue(false);
			expect(service.mediaItemsExistInCache('123', { ...mockDefect, deficiencyCategory: 'minor' })).toBe(false);
		});
	});

	describe('getZipCacheKey', () => {
		it('should build a cache key from the id and category', () => {
			expect(service.getZipCacheKey('123', { category: 'defects' })).toBe('123-defects');
		});
	});

	// =============================
	// ADAS / defect zip retrieval
	// =============================

	describe('getAdasZip', () => {
		it('should return null when the ADAS feature flag is disabled', async () => {
			featureToggleServiceMock.isFeatureEnabled.mockReturnValue(false);
			const result = await service.getAdasZip('123');
			expect(result).toBeNull();
		});

		it('should fetch the zip with the adas category when the feature flag is enabled', async () => {
			featureToggleServiceMock.isFeatureEnabled.mockReturnValue(true);
			const zip = new JSZip();
			const getZipSpy = vi.spyOn(service, 'getZip').mockResolvedValue(zip);

			const result = await service.getAdasZip('123');

			expect(getZipSpy).toHaveBeenCalledWith('123', { category: 'adas' });
			expect(result).toBe(zip);
		});
	});

	describe('getDefectZip', () => {
		it('should fetch the zip with the defects category', async () => {
			const zip = new JSZip();
			const getZipSpy = vi.spyOn(service, 'getZip').mockResolvedValue(zip);

			const result = await service.getDefectZip('123');

			expect(getZipSpy).toHaveBeenCalledWith('123', { category: 'defects' });
			expect(result).toBe(zip);
		});
	});

	// =============================
	// Media loading (extra branches)
	// =============================

	describe('loadMediaItemAsBase64', () => {
		it('should load from the ADAS zip when ADAS media is downloadable', async () => {
			featureToggleServiceMock.isFeatureEnabled.mockReturnValue(true);
			const adasOnlyDefect = { ...mockDefect, deficiencyCategory: 'minor' };
			const zip = new JSZip();
			zip.file('file1.jpg', 'contents');
			vi.spyOn(service, 'getAdasZip').mockResolvedValue(zip);

			const result = await service.loadMediaItemAsBase64(mockTestResult, adasOnlyDefect, { path: 'file1.jpg' } as any);

			expect(result).toBe('objectURL');
			expect(service.fileCache['file1.jpg']).toBe('objectURL');
		});

		it('should load from the defect zip when defect media is downloadable', async () => {
			featureToggleServiceMock.isFeatureEnabled.mockReturnValue(false);
			const zip = new JSZip();
			zip.file('file1.jpg', 'contents');
			vi.spyOn(service, 'getDefectZip').mockResolvedValue(zip);

			const result = await service.loadMediaItemAsBase64(mockTestResult, mockDefect, { path: 'file1.jpg' } as any);

			expect(result).toBe('objectURL');
		});

		it('should return an empty string when no zip could be retrieved', async () => {
			featureToggleServiceMock.isFeatureEnabled.mockReturnValue(false);

			const result = await service.loadMediaItemAsBase64(
				{ ...mockDefect } as any,
				{ ...mockDefect, deficiencyCategory: 'minor' },
				{
					path: 'file1.jpg',
				} as any
			);

			expect(result).toBe('');
		});
	});

	// =============================
	// Download (item-level)
	// =============================

	describe('downloadMediaItem', () => {
		it('should do nothing when the defect has no media', async () => {
			const openSpy = vi.spyOn(service, 'openDocumentFromZip').mockResolvedValue();

			await service.downloadMediaItem(mockTestResult, { ...mockDefect, media: [] }, { path: 'file1.jpg' } as any);

			expect(openSpy).not.toHaveBeenCalled();
		});

		it('should download just the requested media item', async () => {
			const zip = new JSZip();
			zip.file('file1.jpg', 'contents');
			vi.spyOn(service, 'getDefectZip').mockResolvedValue(zip);
			const openSpy = vi.spyOn(service, 'openDocumentFromZip').mockResolvedValue();

			await service.downloadMediaItem(mockTestResult, mockDefect, { path: 'file1.jpg' } as any);

			expect(openSpy).toHaveBeenCalled();
		});
	});

	describe('downloadMediaItems', () => {
		it('should do nothing when the defect has no media', async () => {
			const openSpy = vi.spyOn(service, 'openDocumentFromZip').mockResolvedValue();

			await service.downloadMediaItems(mockTestResult, { ...mockDefect, media: [] });

			expect(openSpy).not.toHaveBeenCalled();
		});

		it('should download all non-failReason media items, skipping missing files', async () => {
			const multiMediaDefect: any = {
				...mockDefect,
				media: [
					{ path: 'file1.jpg', type: 'image' },
					{ path: 'missing.jpg', type: 'image' },
					{ path: 'reason.txt', type: 'failReason' },
				],
			};
			const zip = new JSZip();
			zip.file('file1.jpg', 'contents');
			vi.spyOn(service, 'getDefectZip').mockResolvedValue(zip);
			const openSpy = vi.spyOn(service, 'openDocumentFromZip').mockResolvedValue();

			await service.downloadMediaItems(mockTestResult, multiMediaDefect);

			expect(openSpy).toHaveBeenCalled();
		});

		it('should use the ADAS zip when ADAS media is downloadable', async () => {
			featureToggleServiceMock.isFeatureEnabled.mockReturnValue(true);
			const adasOnlyDefect = { ...mockDefect, deficiencyCategory: 'minor' };
			const zip = new JSZip();
			zip.file('file1.jpg', 'contents');
			vi.spyOn(service, 'getAdasZip').mockResolvedValue(zip);
			const openSpy = vi.spyOn(service, 'openDocumentFromZip').mockResolvedValue();

			await service.downloadMediaItems(mockTestResult, adasOnlyDefect);

			expect(openSpy).toHaveBeenCalled();
		});

		it('should fall back to an empty source zip when the ADAS zip could not be retrieved', async () => {
			featureToggleServiceMock.isFeatureEnabled.mockReturnValue(true);
			const adasOnlyDefect = { ...mockDefect, deficiencyCategory: 'minor' };
			vi.spyOn(service, 'getAdasZip').mockResolvedValue(null);
			const openSpy = vi.spyOn(service, 'openDocumentFromZip').mockResolvedValue();

			await service.downloadMediaItems(mockTestResult, adasOnlyDefect);

			expect(openSpy).toHaveBeenCalled();
		});

		it('should handle errors raised while downloading media items', async () => {
			vi.spyOn(service, 'getDefectZip').mockRejectedValue(new Error('fail'));
			const handleSpy = vi.spyOn(service, 'handleError');

			await service.downloadMediaItems(mockTestResult, mockDefect);

			expect(handleSpy).toHaveBeenCalled();
		});
	});

	describe('openDocumentFromZip', () => {
		it('should create a file link and simulate a click', async () => {
			const zip = new JSZip();
			zip.file('file1.jpg', 'contents');

			await service.openDocumentFromZip(zip, 'my-file');

			expect(documentsServiceMock.createFileLink).toHaveBeenCalledWith('my-file', expect.any(Blob), 'zip');
			expect(documentsServiceMock.simulateClick).toHaveBeenCalled();
		});
	});

	describe('downloadMedia (ADAS path)', () => {
		it('should download and open the ADAS zip when ADAS media is downloadable', async () => {
			vi.spyOn(service, 'canDownloadDefectMedia').mockReturnValue(false);
			vi.spyOn(service, 'canDownloadAdasMedia').mockReturnValue(true);
			const zip = new JSZip();
			vi.spyOn(service, 'getAdasZip').mockResolvedValue(zip);
			const openSpy = vi.spyOn(service, 'openDocumentFromZip').mockResolvedValue();

			await service.downloadMedia(mockTestResult);

			expect(openSpy).toHaveBeenCalledWith(zip, `${mockTestResult.testResultId}`);
		});

		it('should not attempt to open a document when the ADAS zip is null', async () => {
			vi.spyOn(service, 'canDownloadDefectMedia').mockReturnValue(false);
			vi.spyOn(service, 'canDownloadAdasMedia').mockReturnValue(true);
			vi.spyOn(service, 'getAdasZip').mockResolvedValue(null);
			const openSpy = vi.spyOn(service, 'openDocumentFromZip').mockResolvedValue();

			await service.downloadMedia(mockTestResult);

			expect(openSpy).not.toHaveBeenCalled();
		});
	});

	// =============================
	// formatMediaFailureReason
	// =============================

	describe('formatMediaFailureReason', () => {
		it('should return a default message when no reason is provided', () => {
			expect(service.formatMediaFailureReason()).toBe('Reason for failure to capture media not available');
		});

		it('should normalise a "failed to upload" reason regardless of case or trailing punctuation', () => {
			expect(service.formatMediaFailureReason('Failed To Upload.')).toBe('Media failed to upload');
		});

		it('should return the original reason unchanged for any other value', () => {
			expect(service.formatMediaFailureReason('Camera was broken')).toBe('Camera was broken');
		});
	});
});
