import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { DefectMediaDownloadComponent } from '@components/defect-media-download/defect-media-download.component';
import { DefectDetailsSchema } from '@dvsa/cvs-type-definitions/types/v1/test-result';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { DefectMediaService } from '@services/defect-media-service/defect-media-service.service';
import { State, initialAppState } from '@store/index';

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
});
