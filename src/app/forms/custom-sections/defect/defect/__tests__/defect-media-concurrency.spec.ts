import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { DefectDetailsSchema, TestResultSchema } from '@dvsa/cvs-type-definitions/types/v1/test-result';
import { provideMockStore } from '@ngrx/store/testing';
import { DefectMediaService } from '@services/defect-media-service/defect-media-service.service';
import { initialAppState } from '@store/index';
import JSZip from 'jszip';
import { DefectV2Component } from '../../defect-v2/defect-v2.component';
import { DefectComponent } from '../defect.component';

describe.each(['v1', 'v2'] as const)('Defect media concurrency (%s)', (version) => {
	let component: DefectComponent | DefectV2Component;
	let fixture: ComponentFixture<DefectComponent | DefectV2Component>;
	let service: DefectMediaService;
	const defect = {
		imNumber: 29,
		deficiencyCategory: 'dangerous',
		media: [
			{ path: 'first.jpg', type: 'image' },
			{ path: 'second.jpg', type: 'image' },
		],
	} as DefectDetailsSchema;
	const testResult = { testResultId: '123' } as TestResultSchema;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				provideHttpClient(),
				provideHttpClientTesting(),
				provideRouter([]),
				provideMockStore({ initialState: initialAppState }),
				DefectMediaService,
			],
		});
		TestBed.overrideComponent(DefectComponent, { set: { template: '' } });
		TestBed.overrideComponent(DefectV2Component, { set: { template: '' } });
		fixture = version === 'v1' ? TestBed.createComponent(DefectComponent) : TestBed.createComponent(DefectV2Component);
		component = fixture.componentInstance;
		if (component instanceof DefectComponent) {
			component.defect = defect;
			component.testResult = testResult;
		} else {
			vi.spyOn(component, 'defect').mockReturnValue(defect);
			vi.spyOn(component, 'testResult').mockReturnValue(testResult);
		}
		service = TestBed.inject(DefectMediaService);
		vi.spyOn(service, 'canDownloadAdasMediaItems').mockReturnValue(true);
		vi.spyOn(service, 'canDownloadDefectMediaItems').mockReturnValue(true);
	});

	const isLoading = () => (component instanceof DefectComponent ? component.loading : component.loading());

	it('should fetch archives together, then load all media together while retaining the loading state', async () => {
		const adas = Promise.withResolvers<JSZip>();
		const defects = Promise.withResolvers<JSZip>();
		const first = Promise.withResolvers<string>();
		const second = Promise.withResolvers<string>();
		const getAdas = vi.spyOn(service, 'getAdasZip').mockReturnValue(adas.promise);
		const getDefects = vi.spyOn(service, 'getDefectZip').mockReturnValue(defects.promise);
		const load = vi
			.spyOn(service, 'loadMediaItemAsBase64')
			.mockReturnValueOnce(first.promise)
			.mockReturnValueOnce(second.promise);

		const loading = component.loadMediaItems();
		expect(getAdas).toHaveBeenCalledOnce();
		expect(getDefects).toHaveBeenCalledOnce();
		expect(load).not.toHaveBeenCalled();
		expect(isLoading()).toBe(true);
		adas.resolve(new JSZip());
		await Promise.resolve();
		expect(load).not.toHaveBeenCalled();
		defects.resolve(new JSZip());
		await vi.waitFor(() => expect(load).toHaveBeenCalledTimes(2));
		second.resolve('second');
		await Promise.resolve();
		expect(isLoading()).toBe(true);
		first.resolve('first');
		await loading;
		expect(isLoading()).toBe(false);
	});

	it('should report archive failures and clear the loading state without extracting media', async () => {
		const error = new Error('download failed');
		vi.spyOn(service, 'getAdasZip').mockRejectedValue(error);
		vi.spyOn(service, 'getDefectZip').mockResolvedValue(new JSZip());
		const handleError = vi.spyOn(service, 'handleError');
		const load = vi.spyOn(service, 'loadMediaItemAsBase64');

		await component.loadMediaItems();
		expect(handleError).toHaveBeenCalledWith(error, '123');
		expect(load).not.toHaveBeenCalled();
		expect(isLoading()).toBe(false);
	});
});
