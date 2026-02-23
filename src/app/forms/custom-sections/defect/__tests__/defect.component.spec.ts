import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
	DefectCategoryReferenceDataSchema,
	DefectDeficiencyReferenceDataSchema,
	DefectItemReferenceDataSchema,
} from '@dvsa/cvs-type-definitions/types/v1/defect-category-reference-data';
import { DefectDetailsSchema, TestResultSchema } from '@dvsa/cvs-type-definitions/types/v1/test-result';
import { deficiencyCategory } from '@models/defects/deficiency-category.enum';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { DefectMediaService } from '@services/defect-media-service/defect-media-service.service';
import { defects, selectByImNumber } from '@store/defects';
import { State, initialAppState } from '@store/index';
import { selectRouteParams } from '@store/router/router.selectors';
import { createDefect, removeDefect, toEditOrNotToEdit, updateDefect } from '@store/test-records';
import { of } from 'rxjs';
import { DefectComponent } from '../defect.component';

jest.mock('jszip', () => {
	const fileMock = jest.fn();
	const folderMock = jest.fn();
	const generateAsyncMock = jest.fn();
	const loadAsyncMock = jest.fn();
	const filesMock = jest.fn();

	// The constructor function returns an "instance" with methods you need.
	const JSZipMock = jest.fn().mockImplementation(() => ({
		file: fileMock,
		folder: folderMock,
		generateAsync: generateAsyncMock,
		loadAsync: loadAsyncMock,
		files: filesMock,
	}));

	// If you also call static helpers on the default export, attach them here:
	(JSZipMock as any).loadAsync = jest.fn();

	return JSZipMock;
});

describe('DefectComponent', () => {
	let component: DefectComponent;
	let fixture: ComponentFixture<DefectComponent>;
	let router: Router;
	let store: MockStore<State>;
	let defectMediaService: DefectMediaService;

	const deficiency: DefectDeficiencyReferenceDataSchema = {
		deficiencyCategory: deficiencyCategory.Major,
		deficiencyId: 'a',
		deficiencySubId: '',
		deficiencyText: 'missing.',
		forVehicleType: [VehicleTypes.PSV],
		ref: '1.1.a',
		stdForProhibition: false,
	};

	const item: DefectItemReferenceDataSchema = {
		deficiencies: [deficiency],
		forVehicleType: [VehicleTypes.PSV],
		itemDescription: 'A registration plate:',
		itemNumber: 1,
	};

	const defect: DefectCategoryReferenceDataSchema = {
		additionalInfo: {
			[VehicleTypes.PSV]: {
				location: {
					longitudinal: ['front', 'rear'],
				},
				notes: true,
			},
			[VehicleTypes.HGV]: {},
			[VehicleTypes.TRL]: {},
		},
		forVehicleType: [VehicleTypes.PSV],
		imDescription: 'Registration Plate',
		imNumber: 1,
		items: [item],
	};

	const fakeActivatedRoute = {
		snapshot: { data: { key: 'value' } },
	};

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [RouterTestingModule, HttpClientTestingModule],
			providers: [
				{ provide: ActivatedRoute, useValue: fakeActivatedRoute },
				provideMockStore({ initialState: initialAppState }),
				DefectMediaService,
			],
		}).compileComponents();

		router = TestBed.inject(Router);
		store = TestBed.inject(MockStore);
		defectMediaService = TestBed.inject(DefectMediaService);
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(DefectComponent);
		component = fixture.componentInstance;
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should navigate back to test record', () => {
		const navigateSpy = jest.spyOn(router, 'navigate').mockImplementation(() => Promise.resolve(true));
		component.navigateBack();
		expect(navigateSpy).toHaveBeenCalled();
	});

	describe('should initialize info Dictionary', () => {
		it('should initialize notes to true', fakeAsync(() => {
			store.overrideSelector(selectRouteParams, { defectIndex: '0' });
			store.overrideSelector(toEditOrNotToEdit, {
				vehicleType: VehicleTypes.PSV,
				testTypes: [{ defects: [{ imNumber: 1, deficiencyCategory: deficiencyCategory.Major }] }],
			} as TestResultSchema);
			store.overrideSelector(selectByImNumber(1, VehicleTypes.PSV), {
				imNumber: 1,
			} as DefectCategoryReferenceDataSchema);
			tick();
			fixture.detectChanges();

			component.initializeInfoDictionary(defect);
			expect(component.includeNotes).toBe(true);
		}));

		it('should initialize info dictionary to the longitude', fakeAsync(() => {
			store.overrideSelector(selectRouteParams, { defectIndex: '0' });
			store.overrideSelector(toEditOrNotToEdit, {
				vehicleType: VehicleTypes.PSV,
				testTypes: [{ defects: [{ imNumber: 1, deficiencyCategory: deficiencyCategory.Major }] }],
			} as TestResultSchema);
			store.overrideSelector(selectByImNumber(1, VehicleTypes.PSV), {
				imNumber: 1,
			} as DefectCategoryReferenceDataSchema);
			tick();
			fixture.detectChanges();

			component.initializeInfoDictionary(defect);
			expect(component.infoDictionary).toEqual({
				longitudinal: [
					{
						label: 'Front',
						value: 'front',
					},
					{
						label: 'Rear',
						value: 'rear',
					},
				],
			});
		}));
	});

	describe('should initialize defect', () => {
		it('should initialize defect using index', fakeAsync(() => {
			store.overrideSelector(selectRouteParams, { defectIndex: '0' });
			store.overrideSelector(toEditOrNotToEdit, {
				vehicleType: VehicleTypes.PSV,
				testTypes: [{ defects: [{ imNumber: 1, deficiencyCategory: deficiencyCategory.Major }] }],
			} as TestResultSchema);
			store.overrideSelector(selectByImNumber(1, VehicleTypes.PSV), {
				imNumber: 1,
			} as DefectCategoryReferenceDataSchema);
			tick();
			fixture.detectChanges();

			expect(component.defect).toBeDefined();
		}));

		it('should initialize defect using ref', fakeAsync(() => {
			store.overrideSelector(selectRouteParams, { ref: '1.1.a' });
			store.overrideSelector(toEditOrNotToEdit, {
				vehicleType: VehicleTypes.PSV,
				testTypes: [
					{ defects: [{ imNumber: 1, imDescription: 'desc', deficiencyCategory: deficiencyCategory.Major }] },
				],
			} as TestResultSchema);
			store.overrideSelector(defects, [defect]);
			tick();
			fixture.detectChanges();

			expect(component.defect).toBeDefined();
		}));
	});

	describe('should get isDangerous', () => {
		it('should return true when defect is dangerous', () => {
			component.defect = { deficiencyCategory: deficiencyCategory.Dangerous } as DefectDetailsSchema;
			expect(component.isDangerous).toBe(true);
		});
		it('should return false when defect is advisory', () => {
			component.defect = { deficiencyCategory: deficiencyCategory.Advisory } as DefectDetailsSchema;
			expect(component.isDangerous).toBe(false);
		});
		it('should return false when defect is major', () => {
			component.defect = { deficiencyCategory: deficiencyCategory.Major } as DefectDetailsSchema;
			expect(component.isDangerous).toBe(false);
		});
		it('should return false when defect is minor', () => {
			component.defect = { deficiencyCategory: deficiencyCategory.Minor } as DefectDetailsSchema;
			expect(component.isDangerous).toBe(false);
		});
	});

	describe('should get isAdvisory', () => {
		it('should return true when defect is advisory', () => {
			component.defect = { deficiencyCategory: deficiencyCategory.Advisory } as DefectDetailsSchema;
			expect(component.isAdvisory).toBe(true);
		});
		it('should return false when defect is dangerous', () => {
			component.defect = { deficiencyCategory: deficiencyCategory.Dangerous } as DefectDetailsSchema;
			expect(component.isAdvisory).toBe(false);
		});
		it('should return false when defect is major', () => {
			component.defect = { deficiencyCategory: deficiencyCategory.Major } as DefectDetailsSchema;
			expect(component.isAdvisory).toBe(false);
		});
		it('should return false when defect is minor', () => {
			component.defect = { deficiencyCategory: deficiencyCategory.Minor } as DefectDetailsSchema;
			expect(component.isAdvisory).toBe(false);
		});
	});

	describe('should dispatch', () => {
		it('should dispatch create defect action', fakeAsync(() => {
			store.overrideSelector(selectRouteParams, { ref: '1.1.a' });
			store.overrideSelector(toEditOrNotToEdit, {
				vehicleType: VehicleTypes.PSV,
				testTypes: [
					{ defects: [{ imNumber: 1, imDescription: 'desc', deficiencyCategory: deficiencyCategory.Major }] },
				],
			} as TestResultSchema);
			store.overrideSelector(defects, [defect]);
			tick();
			fixture.detectChanges();

			const dispatchSpy = jest.spyOn(store, 'dispatch');
			component.handleSubmit();

			expect(dispatchSpy).toHaveBeenCalledWith(
				createDefect({ defect: component.form.getCleanValue(component.form) as DefectDetailsSchema })
			);
		}));

		it('should dispatch update defect action', fakeAsync(() => {
			store.overrideSelector(selectRouteParams, { defectIndex: '0' });
			store.overrideSelector(toEditOrNotToEdit, {
				vehicleType: VehicleTypes.PSV,
				testTypes: [{ defects: [{ imNumber: 1, deficiencyCategory: deficiencyCategory.Major }] }],
			} as TestResultSchema);
			store.overrideSelector(selectByImNumber(1, VehicleTypes.PSV), {
				imNumber: 1,
			} as DefectCategoryReferenceDataSchema);
			tick();
			fixture.detectChanges();

			const dispatchSpy = jest.spyOn(store, 'dispatch');
			component.handleSubmit();

			expect(dispatchSpy).toHaveBeenCalledWith(
				updateDefect({
					defect: component.form.getCleanValue(component.form) as DefectDetailsSchema,
					index: component.index,
				})
			);
		}));

		it('should dispatch delete defect action', fakeAsync(() => {
			store.overrideSelector(selectRouteParams, { defectIndex: '0' });
			store.overrideSelector(toEditOrNotToEdit, {
				vehicleType: VehicleTypes.PSV,
				testTypes: [{ defects: [{ imNumber: 1, deficiencyCategory: deficiencyCategory.Major }] }],
			} as TestResultSchema);
			store.overrideSelector(selectByImNumber(1, VehicleTypes.PSV), {
				imNumber: 1,
			} as DefectCategoryReferenceDataSchema);
			tick();
			fixture.detectChanges();

			const dispatchSpy = jest.spyOn(store, 'dispatch');
			component.handleRemove();

			expect(dispatchSpy).toHaveBeenCalledWith(removeDefect({ index: component.index }));
		}));
	});

	describe('downloadAllMedia', () => {
		it('should download media from cache if cached media exists', async () => {
			if (component.defectMediaService) {
				const cacheSpy = jest.spyOn(component, 'downloadAllMediaFromCache').mockImplementation(() => Promise.resolve());
				const httpSpy = jest.spyOn(component, 'downloadAllMediaFromHttp').mockImplementation(() => Promise.resolve());
				jest.spyOn(component.defectMediaService, 'hasCachedImages').mockReturnValue(true);
				component.defect = {
					imNumber: 1,
				} as DefectDetailsSchema;
				component.testResultId = 'testResultId';
				await component.downloadAllMedia();
				expect(cacheSpy).toHaveBeenCalled();
				expect(httpSpy).not.toHaveBeenCalled();
			}
		});
		it('should download media via http if cached media does not exist', async () => {
			if (component.defectMediaService) {
				const cacheSpy = jest.spyOn(component, 'downloadAllMediaFromCache').mockImplementation(() => Promise.resolve());
				const httpSpy = jest.spyOn(component, 'downloadAllMediaFromHttp').mockImplementation(() => Promise.resolve());
				jest.spyOn(component.defectMediaService, 'hasCachedImages').mockReturnValue(false);
				component.defect = {
					imNumber: 1,
				} as DefectDetailsSchema;
				component.testResultId = 'testResultId';
				await component.downloadAllMedia();
				expect(cacheSpy).not.toHaveBeenCalled();
				expect(httpSpy).toHaveBeenCalled();
			}
		});
	});
	describe('downloadPhoto', () => {
		it('should download media from cache if cached media exists', async () => {
			if (component.defectMediaService) {
				component.defect = {
					imNumber: 1,
				} as DefectDetailsSchema;
				component.testResultId = 'testResultId';
				jest.spyOn(component.defectMediaService, 'getImage').mockReturnValue('image');
				const httpSpy = jest.spyOn(component, 'downloadPhotoFromHttp').mockImplementation(() => Promise.resolve());
				const cacheSpy = jest.spyOn(component, 'downloadPhotoFromCache').mockImplementation(() => Promise.resolve());
				await component.downloadPhoto({ path: 'test', type: 'image' });
				expect(cacheSpy).toHaveBeenCalled();
				expect(httpSpy).not.toHaveBeenCalled();
			}
		});
		it('should download media from http if cached media does not exist', async () => {
			if (component.defectMediaService) {
				component.defect = {
					imNumber: 1,
				} as DefectDetailsSchema;
				component.testResultId = 'testResultId';
				jest.spyOn(component.defectMediaService, 'getImage').mockReturnValue('');
				const httpSpy = jest.spyOn(component, 'downloadPhotoFromHttp').mockImplementation(() => Promise.resolve());
				const cacheSpy = jest.spyOn(component, 'downloadPhotoFromCache').mockImplementation(() => Promise.resolve());
				await component.downloadPhoto({ path: 'test', type: 'image' });
				expect(cacheSpy).not.toHaveBeenCalled();
				expect(httpSpy).toHaveBeenCalled();
			}
		});
	});

	describe('downloadPhotoFromCache', () => {
		it('should download media from cache if cached media does exist', async () => {
			if (component.defectMediaService) {
				const downloadZipSpy = jest
					.spyOn(component.defectMediaService, 'openDocumentFromZip')
					.mockImplementation(() => Promise.resolve());
				component.defect = {
					imNumber: 1,
				} as DefectDetailsSchema;

				await component.downloadPhotoFromCache('image', { type: 'image', path: 'test' });

				expect(downloadZipSpy).toHaveBeenCalled();
			}
		});
	});

	describe('downloadPhotoFromHttp', () => {
		it('should download media from http if cached media does not exist', async () => {
			if (component.defectMediaService) {
				const openZipSpy = jest
					.spyOn(component.defectMediaService, 'openDocumentFromZip')
					.mockImplementation(() => Promise.resolve());
				const presignedUrlSpy = jest
					.spyOn(component.defectMediaService, 'getPresignedUrlValue')
					.mockReturnValue(of(''));
				const httpSpy = jest.spyOn(component.http, 'get').mockReturnValue(of(new Blob(['data'])));
				component.testResultId = 'testResultId';
				const defect = {
					imNumber: 1,
				} as DefectDetailsSchema;
				defect.media = [{ type: 'image', path: 'image1' }];
				component.defect = defect;

				await component.downloadPhotoFromHttp({ type: 'image', path: '' });

				expect(openZipSpy).toHaveBeenCalled();
				expect(presignedUrlSpy).toHaveBeenCalled();
				expect(httpSpy).toHaveBeenCalled();
			}
		});
	});
});
