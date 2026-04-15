import type { Mock } from 'vitest';
import { GlobalErrorService } from '@/src/app/core/components/global-error/global-error.service';
import { initialAppState } from '@/src/app/store';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DefectDetailsSchema } from '@dvsa/cvs-type-definitions/types/v1/test-result';
import { provideMockStore } from '@ngrx/store/testing';
import { DefectMediaService } from '@services/defect-media-service/defect-media-service.service';
import { selectedTestResultState } from '@store/test-records';
import JSZip from 'jszip';
import { DefectMediaDownloadComponent } from '../defect-media-download.component';

describe('DefectMediaDownloadComponent', () => {
	let component: DefectMediaDownloadComponent;
	let fixture: ComponentFixture<DefectMediaDownloadComponent>;
	let globalErrorService: GlobalErrorService;
	let defectMediaService: {
		images: Record<string, string>;
		hasImages: Mock;
		hasCachedImages: Mock;
		getDefectZip: Mock;
		openDocumentFromZip: Mock;
		handleError: Mock;
		hasRententionPeriodExpired: Mock;
		formatMediaFailureReason: Mock;
	};

	beforeEach(async () => {
		defectMediaService = {
			images: {},
			hasImages: vi.fn(
				(defect: DefectDetailsSchema) => !!defect.media?.some((media) => media.type !== 'failReason' && !!media.path)
			),
			hasCachedImages: vi.fn(),
			getDefectZip: vi.fn(),
			openDocumentFromZip: vi.fn(),
			handleError: vi.fn(),
			hasRententionPeriodExpired: vi.fn(),
			formatMediaFailureReason: vi.fn(
				(reason?: string) => reason ?? 'Reason for failure to capture media not available'
			),
		};

		await TestBed.configureTestingModule({
			imports: [DefectMediaDownloadComponent],
			providers: [
				provideMockStore({
					initialState: initialAppState,
					selectors: [
						{
							selector: selectedTestResultState,
							value: {
								testResultId: 'test-result-id',
								testTypes: [
									{
										defects: [
											{ media: [{ type: 'image', path: 'a.jpg' }] },
											{ media: [{ type: 'image', path: 'b.jpg' }] },
										],
									},
								],
							},
						},
					],
				}),
				{ provide: DefectMediaService, useValue: defectMediaService },
				{ provide: GlobalErrorService, useValue: { clearErrors: vi.fn(), setErrors: vi.fn() } },
			],
		}).compileComponents();

		fixture = TestBed.createComponent(DefectMediaDownloadComponent);
		component = fixture.componentInstance;
		component.defect = {
			imNumber: 1,
			imDescription: 'Brake issue',
			media: [{ type: 'image', path: 'a.jpg' }],
		} as DefectDetailsSchema;
		fixture.detectChanges();

		globalErrorService = TestBed.inject(GlobalErrorService);
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('canDownloadMedia', () => {
		it('should return false if media is undefined', () => {
			component.defect = { imNumber: 1, imDescription: 'x', media: undefined } as DefectDetailsSchema;
			expect(component.canDownloadMedia()).toBe(false);
		});

		it('should return false if media contains only fail reasons', () => {
			component.defect = {
				imNumber: 1,
				imDescription: 'x',
				media: [
					{ type: 'failReason', reason: 'foo' },
					{ type: 'failReason', reason: 'bar' },
				],
			} as DefectDetailsSchema;
			expect(component.canDownloadMedia()).toBe(false);
		});

		it('should return true if media contains images', () => {
			expect(component.canDownloadMedia()).toBe(true);
		});
	});

	describe('getFailureToCaptureDefectMediaReason', () => {
		it('should return default reason when media is undefined', () => {
			component.defect = { imNumber: 1, imDescription: 'x', media: undefined } as DefectDetailsSchema;
			expect(component.getFailureToCaptureDefectMediaReason()).toBe('No media available');
		});

		it('should return first fail reason when provided', () => {
			component.defect = {
				imNumber: 1,
				imDescription: 'x',
				deficiencyCategory: 'dangerous',
				media: [
					{ type: 'failReason', reason: 'foo' },
					{ type: 'failReason', reason: 'bar' },
				],
			} as DefectDetailsSchema;
			expect(component.getFailureToCaptureDefectMediaReason()).toBe('No media available');
		});

		it('should return No media available when the deficiencyCategory is not dangerous', () => {
			component.defect = {
				imNumber: 1,
				imDescription: 'x',
				deficiencyCategory: 'minor',
				media: [
					{ type: 'failReason', reason: 'foo' },
					{ type: 'failReason', reason: 'bar' },
				],
			} as DefectDetailsSchema;
			expect(component.getFailureToCaptureDefectMediaReason()).toBe('No media available');
		});
	});

	describe('ngOnDestroy', () => {
		it('should clear global errors', () => {
			const clearErrorsSpy = vi.spyOn(globalErrorService, 'clearErrors');
			component.ngOnDestroy();
			expect(clearErrorsSpy).toHaveBeenCalledTimes(1);
		});
	});

	describe('downloadMedia', () => {
		it('should build and download only the selected defect from cache', async () => {
			defectMediaService.hasCachedImages.mockReturnValue(true);
			defectMediaService.images['a.jpg'] = 'cached-a';
			defectMediaService.images['b.jpg'] = 'cached-b';

			await component.downloadMedia();

			expect(defectMediaService.getDefectZip).not.toHaveBeenCalled();
			expect(defectMediaService.openDocumentFromZip).toHaveBeenCalledTimes(1);

			const zipArg = defectMediaService.openDocumentFromZip.mock.calls[0][0] as JSZip;
			expect(Object.keys(zipArg.files)).toContain('a.jpg');
			expect(Object.keys(zipArg.files)).not.toContain('b.jpg');
		});

		it('should fetch once, cache all defect images, and download only selected defect', async () => {
			defectMediaService.hasCachedImages.mockReturnValue(false);

			const zip = new JSZip();
			zip.file('a.jpg', 'file-a');
			zip.file('b.jpg', 'file-b');
			defectMediaService.getDefectZip.mockResolvedValue(zip);

			await component.downloadMedia();

			expect(defectMediaService.getDefectZip).toHaveBeenCalledWith('test-result-id');
			expect(defectMediaService.images['a.jpg']).toBeDefined();
			expect(defectMediaService.images['b.jpg']).toBeDefined();
			expect(defectMediaService.openDocumentFromZip).toHaveBeenCalledTimes(1);

			const zipArg = defectMediaService.openDocumentFromZip.mock.calls[0][0] as JSZip;
			expect(Object.keys(zipArg.files)).toContain('a.jpg');
			expect(Object.keys(zipArg.files)).not.toContain('b.jpg');
		});
	});
});
