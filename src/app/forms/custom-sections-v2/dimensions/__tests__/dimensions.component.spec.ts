import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
	ControlContainer,
	FormControl,
	FormGroup,
	FormGroupDirective,
	FormsModule,
	ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DimensionsComponent } from '@forms/custom-sections-v2/dimensions/dimensions.component';
import { createMockPsv } from '@mocks/psv-record.mock';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { initialAppState } from '@store/index';
import { of } from 'rxjs';

describe('DimensionsComponent', () => {
	let controlContainer: ControlContainer;
	let component: DimensionsComponent;
	let fixture: ComponentFixture<DimensionsComponent>;
	let formGroupDirective: FormGroupDirective;
	let store: MockStore;

	beforeEach(async () => {
		formGroupDirective = new FormGroupDirective([], []);
		formGroupDirective.form = new FormGroup({
			techRecord_dimensions_height: new FormControl(),
		});

		await TestBed.configureTestingModule({
			imports: [FormsModule, ReactiveFormsModule, DimensionsComponent],
			providers: [
				provideMockStore({ initialState: initialAppState }),
				provideHttpClient(),
				provideHttpClientTesting(),
				{ provide: ControlContainer, useValue: formGroupDirective },
				{ provide: ActivatedRoute, useValue: { params: of([{ id: 1 }]) } },
			],
		}).compileComponents();

		store = TestBed.inject(MockStore);
		controlContainer = TestBed.inject(ControlContainer);

		fixture = TestBed.createComponent(DimensionsComponent);
		fixture.componentRef.setInput('techRecord', createMockPsv(100000));
		component = fixture.componentInstance;
		component.form.reset();
		fixture.detectChanges();
	});

	describe('ngOnInit', () => {
		it('should attach its form to its parent form', () => {
			const spy = jest.spyOn(controlContainer.control as FormGroup, 'addControl');
			component.ngOnInit();
			expect(spy).toHaveBeenCalled();
		});
	});

	describe('ngOnDestroy', () => {
		it('should unsubscribe from all subscriptions', () => {
			const spy = jest.spyOn(component.destroy$, 'complete');
			component.ngOnDestroy();
			expect(spy).toHaveBeenCalled();
		});

		it('should detach its form from its parent form', () => {
			const spy = jest.spyOn(controlContainer.control as FormGroup, 'removeControl');
			component.ngOnDestroy();
			expect(spy).toHaveBeenCalled();
		});
	});
});
