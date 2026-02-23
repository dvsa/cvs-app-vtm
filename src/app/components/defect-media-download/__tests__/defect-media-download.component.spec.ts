import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { DefectMediaDownloadComponent } from '@components/defect-media-download/defect-media-download.component';
import { DefectDetailsSchema } from '@dvsa/cvs-type-definitions/types/v1/test-result';
import { createMockTestResult } from '@mocks/test-result.mock';
import { createMockTestType } from '@mocks/test-type.mock';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { DefectMediaService } from '@services/defect-media-service/defect-media-service.service';
import { State, initialAppState } from '@store/index';
import { selectedTestResultState } from '@store/test-records';
import { of } from 'rxjs';

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
		files: fileMock,
	}));

	// If you also call static helpers on the default export, attach them here:
	(JSZipMock as any).loadAsync = jest.fn();

	return JSZipMock;
});

describe('DefectMediaDownloadComponent', () => {
	let component: DefectMediaDownloadComponent;
	let fixture: ComponentFixture<DefectMediaDownloadComponent>;
	let router: Router;
	let store: MockStore<State>;
	let defectMediaService: DefectMediaService;

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
		fixture = TestBed.createComponent(DefectMediaDownloadComponent);
		component = fixture.componentInstance;
	});

	describe('downloadAllMedia', () => {
		it('should download media from cache if cached media exists', async () => {
			if (component.defectMediaService) {
				const cacheSpy = jest.spyOn(component, 'downloadMediaFromCache').mockImplementation(() => Promise.resolve());
				const httpSpy = jest.spyOn(component, 'downloadMediaFromHttp').mockImplementation(() => Promise.resolve());
				jest.spyOn(component.defectMediaService, 'hasCachedImages').mockReturnValue(true);
				component.defect = {
					imNumber: 1,
				} as DefectDetailsSchema;
				await component.downloadMedia();
				expect(cacheSpy).toHaveBeenCalled();
				expect(httpSpy).not.toHaveBeenCalled();
			}
		});
		it('should download media via http if cached media does not exist', async () => {
			if (component.defectMediaService) {
				const cacheSpy = jest.spyOn(component, 'downloadMediaFromCache').mockImplementation(() => Promise.resolve());
				const httpSpy = jest.spyOn(component, 'downloadMediaFromHttp').mockImplementation(() => Promise.resolve());
				jest.spyOn(component.defectMediaService, 'hasCachedImages').mockReturnValue(false);
				component.defect = {
					imNumber: 1,
				} as DefectDetailsSchema;
				await component.downloadMedia();
				expect(cacheSpy).not.toHaveBeenCalled();
				expect(httpSpy).toHaveBeenCalled();
			}
		});
	});
	describe('downloadMediaFromCache', () => {
		it('should download media from cache if cached media does exist', async () => {
			if (component.defectMediaService) {
				const imagesSpy = jest.spyOn(component.defectMediaService, 'getImages').mockReturnValue({ image1: 'image1' });
				const openZipSpy = jest
					.spyOn(component.defectMediaService, 'openDocumentFromZip')
					.mockImplementation(() => Promise.resolve());
				const canDownloadMediaSpy = jest.spyOn(component, 'canDownloadMedia').mockReturnValue(true);
				const defect: DefectDetailsSchema = {
					imNumber: 1,
				} as DefectDetailsSchema;
				defect.media = [{ type: 'image', path: 'image1' }];
				component.defect = defect;

				await component.downloadMediaFromCache();

				expect(imagesSpy).toHaveBeenCalled();
				expect(canDownloadMediaSpy).toHaveBeenCalled();
				expect(openZipSpy).toHaveBeenCalled();
			}
		});
		it('should download media from http if cached media does not exist', async () => {
			if (component.defectMediaService) {
				const openZipSpy = jest
					.spyOn(component.defectMediaService, 'openDocumentFromZip')
					.mockImplementation(() => Promise.resolve());
				const canDownloadMediaSpy = jest.spyOn(component, 'canDownloadMedia').mockReturnValue(true);
				const presignedUrlSpy = jest
					.spyOn(component.defectMediaService, 'getPresignedUrlValue')
					.mockReturnValue(of(''));
				const httpSpy = jest.spyOn(component.http, 'get').mockReturnValue(of(new Blob(['data'])));
				const testResult = createMockTestResult({
					vehicleType: VehicleTypes.HGV,
					testTypes: [createMockTestType({ testTypeId: '39' })],
					testResultId: 'testResultId',
				});
				const defect: DefectDetailsSchema = {
					imNumber: 1,
				} as DefectDetailsSchema;
				defect.media = [{ type: 'image', path: 'image1' }];
				component.defect = defect;
				store.overrideSelector(selectedTestResultState, testResult);

				await component.downloadMediaFromHttp();

				expect(canDownloadMediaSpy).toHaveBeenCalled();
				expect(openZipSpy).toHaveBeenCalled();
				expect(presignedUrlSpy).toHaveBeenCalled();
				expect(httpSpy).toHaveBeenCalled();
			}
		});
	});
});
