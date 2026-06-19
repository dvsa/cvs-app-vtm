import { GlobalErrorService } from '@/src/app/core/components/global-error/global-error.service';
import { initialAppState } from '@/src/app/store';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DefectDetailsSchema } from '@dvsa/cvs-type-definitions/types/v1/test-result';
import { provideMockStore } from '@ngrx/store/testing';
import { DefectMediaService } from '@services/defect-media-service/defect-media-service.service';
import { selectedTestResultState } from '@store/test-records';
import { DefectMediaDownloadComponent } from '../defect-media-download.component';

describe('DefectMediaDownloadComponent', () => {
	let component: DefectMediaDownloadComponent;
	let fixture: ComponentFixture<DefectMediaDownloadComponent>;
	let globalErrorService: GlobalErrorService;
	let defectMediaService: {
		openDocumentFromZip: jest.Mock;
		handleError: jest.Mock;
		hasRententionPeriodExpired: jest.Mock;
		formatMediaFailureReason: jest.Mock;
		canDownloadMediaItems: jest.Mock;
	};

	beforeEach(async () => {
		defectMediaService = {
			openDocumentFromZip: jest.fn(),
			handleError: jest.fn(),
			hasRententionPeriodExpired: jest.fn(),
			formatMediaFailureReason: jest.fn(
				(reason?: string) => reason ?? 'Reason for failure to capture media not available'
			),
			canDownloadMediaItems: jest.fn(),
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
				{ provide: GlobalErrorService, useValue: { clearErrors: jest.fn(), setErrors: jest.fn() } },
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
			const clearErrorsSpy = jest.spyOn(globalErrorService, 'clearErrors');
			component.ngOnDestroy();
			expect(clearErrorsSpy).toHaveBeenCalledTimes(1);
		});
	});
});
