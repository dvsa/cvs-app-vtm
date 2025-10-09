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
import { DocumentsComponent } from '../documents.component';

describe('DocumentsComponent', () => {
	let component: DocumentsComponent;
	let fixture: ComponentFixture<DocumentsComponent>;
	let formGroupDirective: FormGroupDirective;

	beforeEach(async () => {
		formGroupDirective = new FormGroupDirective([], []);
		formGroupDirective.form = new FormGroup<Partial<Record<keyof TechRecordType<'psv'>, FormControl>>>({});

		await TestBed.configureTestingModule({
			imports: [FormsModule, ReactiveFormsModule, DocumentsComponent],
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

		fixture = TestBed.createComponent(DocumentsComponent);
		component = fixture.componentInstance;
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
