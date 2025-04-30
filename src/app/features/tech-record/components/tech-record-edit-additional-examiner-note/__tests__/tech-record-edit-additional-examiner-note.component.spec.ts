import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, provideRouter } from '@angular/router';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { initialAppState } from '@store/index';
import { of } from 'rxjs';
import { TechRecordEditAdditionalExaminerNoteComponent } from '../tech-record-edit-additional-examiner-note.component';

const mockTechRecordService = {
	techRecord$: jest.fn(),
};
describe('TechRecordEditAdditionalExaminerNoteComponent', () => {
	let fixture: ComponentFixture<TechRecordEditAdditionalExaminerNoteComponent>;
	let component: TechRecordEditAdditionalExaminerNoteComponent;
	let router: Router;
	let errorService: GlobalErrorService;
	let route: ActivatedRoute;
	let store: MockStore;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [TechRecordEditAdditionalExaminerNoteComponent, FormsModule, ReactiveFormsModule],
			providers: [
				provideRouter([]),
				{ provide: TechnicalRecordService, useValue: mockTechRecordService },
				provideMockStore({ initialState: initialAppState }),
				{ provide: ActivatedRoute, useValue: { params: of([{ id: 1 }]) } },
			],
		}).compileComponents();
		fixture = TestBed.createComponent(TechRecordEditAdditionalExaminerNoteComponent);
		component = fixture.componentInstance;
		router = TestBed.inject(Router);
		errorService = TestBed.inject(GlobalErrorService);
		route = TestBed.inject(ActivatedRoute);
		store = TestBed.inject(MockStore);
	});
	it('should create', () => {
		expect(component).toBeTruthy();
	});
	describe('ngOnInit', () => {
		it('should call all initialisation functions', () => {
			const examinerNoteSpy = jest.spyOn(component, 'getExaminerNote').mockReturnValue();
			const techRecordSpy = jest.spyOn(component, 'getTechRecord').mockReturnValue();
			const formSpy = jest.spyOn(component, 'setupForm').mockReturnValue();
			component.ngOnInit();
			expect(examinerNoteSpy).toHaveBeenCalled();
			expect(formSpy).toHaveBeenCalled();
			expect(techRecordSpy).toHaveBeenCalled();
		});
	});
	describe('navigateBack', () => {
		it('should clear all errors', () => {
			jest.spyOn(router, 'navigate').mockImplementation();

			const clearErrorsSpy = jest.spyOn(errorService, 'clearErrors');

			component.navigateBack();

			expect(clearErrorsSpy).toHaveBeenCalledTimes(1);
		});

		it('should navigate back to the previous page', () => {
			const navigateSpy = jest.spyOn(router, 'navigate').mockImplementation(() => Promise.resolve(true));

			component.navigateBack();

			expect(navigateSpy).toHaveBeenCalledWith(['../../'], { relativeTo: route });
		});
	});
	describe('handleSubmit', () => {
		it('should not dispatch an action if the notes are the same', () => {
			const storeSpy = jest.spyOn(store, 'dispatch');
			const navigateBackSpy = jest.spyOn(component, 'navigateBack').mockReturnValue();
			component.originalExaminerNote = 'foobar';
			component.editedExaminerNote = 'foobar';
			component.handleSubmit();
			expect(storeSpy).not.toHaveBeenCalled();
			expect(navigateBackSpy).toHaveBeenCalled();
		});

		it('should dispatch an action if the notes are not the same', () => {
			const storeSpy = jest.spyOn(store, 'dispatch');
			const navigateBackSpy = jest.spyOn(component, 'navigateBack').mockReturnValue();
			component.originalExaminerNote = 'foo';
			component.editedExaminerNote = 'bar';
			component.handleSubmit();
			expect(storeSpy).toHaveBeenCalled();
			expect(navigateBackSpy).toHaveBeenCalled();
		});
	});
});
