import { initialAppState } from '@/src/app/store';
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
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { DDAComponent } from '../dda.component';

describe('DDAComponent', () => {
	let component: DDAComponent;
	let fixture: ComponentFixture<DDAComponent>;
	let formGroupDirective: FormGroupDirective;

	beforeEach(async () => {
		formGroupDirective = new FormGroupDirective([], []);
		formGroupDirective.form = new FormGroup<Partial<Record<keyof TechRecordType<'psv'>, FormControl>>>({});

		await TestBed.configureTestingModule({
			imports: [FormsModule, ReactiveFormsModule, DDAComponent],
			providers: [
				provideMockStore({ initialState: initialAppState }),
				provideHttpClient(),
				provideHttpClientTesting(),
				{ provide: ControlContainer, useValue: formGroupDirective },
				{
					provide: ActivatedRoute,
					useValue: {
						params: of([{ id: 1 }]),
						snapshot: {
							data: {
								reason: 'edit',
							},
						},
					},
				},
			],
		}).compileComponents();

		fixture = TestBed.createComponent(DDAComponent);
		component = fixture.componentInstance;
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
