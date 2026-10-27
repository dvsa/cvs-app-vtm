import { Modes } from '@/src/app/models/modes.enum';
import { initialAppState } from '@/src/app/store';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ControlContainer, FormGroup, FormGroupDirective } from '@angular/forms';
import { mockTestResult } from '@mocks/mock-test-result';
import { provideMockStore } from '@ngrx/store/testing';
import { toEditOrNotToEdit } from '@store/test-records';
import { NotesComponent } from '../notes.component';

describe('NotesComponent', () => {
	let fixture: ComponentFixture<NotesComponent>;
	let component: NotesComponent;
	let formGroupDirective: FormGroupDirective;

	beforeEach(async () => {
		formGroupDirective = new FormGroupDirective([], []);
		formGroupDirective.form = new FormGroup({});

		await TestBed.configureTestingModule({
			imports: [NotesComponent],
			providers: [
				{ provide: ControlContainer, useValue: formGroupDirective },
				provideMockStore({
					initialState: initialAppState,
					selectors: [{ selector: toEditOrNotToEdit, value: mockTestResult() }],
				}),
			],
		}).compileComponents();

		fixture = TestBed.createComponent(NotesComponent);
		component = fixture.componentInstance;
		fixture.componentRef.setInput('mode', Modes.EDIT);
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
