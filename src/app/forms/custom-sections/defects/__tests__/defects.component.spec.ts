import { selectedTestResultState } from '@/src/app/store/test-records';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { ButtonComponent } from '@components/button/button.component';
import { TagComponent } from '@components/tag/tag.component';
import { TestResultSchema } from '@dvsa/cvs-type-definitions/types/v1/test-result';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TruncatePipe } from '@pipes/truncate/truncate.pipe';
import { DynamicFormService } from '@services/dynamic-forms/dynamic-form.service';
import { initialAppState } from '@store/index';
import { DefectSelectComponent } from '../../../components/defect-select/defect-select.component';
import { DefectComponent } from '../../defect/defect.component';
import { DefectsComponent } from '../defects.component';

describe('DefectsComponent', () => {
	let component: DefectsComponent;
	let fixture: ComponentFixture<DefectsComponent>;
	let el: DebugElement;
	let store: MockStore;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [
				FormsModule,
				ReactiveFormsModule,
				DefectComponent,
				DefectSelectComponent,
				DefectsComponent,
				ButtonComponent,
				TruncatePipe,
				TagComponent,
			],
			providers: [
				DynamicFormService,
				provideRouter([]),
				provideHttpClient(),
				provideHttpClientTesting(),
				provideMockStore({ initialState: initialAppState }),
			],
		}).compileComponents();
	});

	beforeEach(() => {
		store = TestBed.inject(MockStore);
		store.overrideSelector(selectedTestResultState, {} as TestResultSchema);
		fixture = TestBed.createComponent(DefectsComponent);
		fixture.componentRef.setInput('defects', null);
		fixture.componentRef.setInput('template', {});
		fixture.detectChanges();
		component = fixture.componentInstance;
		el = fixture.debugElement;
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should render correct header', () => {
		fixture.detectChanges();
		expect(el.query(By.css('h2')).nativeElement.innerHTML).toBe('Defects');
	});

	describe('No defects', () => {
		it('should be displayed when defects is undefined or empty array', fakeAsync(() => {
			const expectedText = 'No defects';

			tick();
			fixture.detectChanges();

			let text: HTMLParagraphElement = el.query(By.css('p')).nativeElement;
			expect(text.innerHTML).toBe(expectedText);

			tick();
			fixture.detectChanges();

			text = el.query(By.css('p')).nativeElement;
			expect(text.innerHTML).toBe(expectedText);
		}));
	});

	describe('downloadAllMedia', () => {
		it('should download media from cache if cached media exists', async () => {
			if (component.defectMediaService) {
				const cacheSpy = jest.spyOn(component, 'downloadMediaFromCache').mockImplementation(() => Promise.resolve());
				const httpSpy = jest.spyOn(component, 'downloadMediaFromHttp').mockImplementation(() => Promise.resolve());
				jest.spyOn(component.defectMediaService, 'hasCachedTestResultImages').mockReturnValue(true);
				await component.downloadAllMedia();
				expect(cacheSpy).toHaveBeenCalled();
				expect(httpSpy).not.toHaveBeenCalled();
			}
		});
		it('should download media via http if cached media does not exist', async () => {
			if (component.defectMediaService) {
				const cacheSpy = jest.spyOn(component, 'downloadMediaFromCache').mockImplementation(() => Promise.resolve());
				const httpSpy = jest.spyOn(component, 'downloadMediaFromHttp').mockImplementation(() => Promise.resolve());
				jest.spyOn(component.defectMediaService, 'hasCachedImages').mockReturnValue(false);
				await component.downloadAllMedia();
				expect(cacheSpy).not.toHaveBeenCalled();
				expect(httpSpy).toHaveBeenCalled();
			}
		});
	});
});
