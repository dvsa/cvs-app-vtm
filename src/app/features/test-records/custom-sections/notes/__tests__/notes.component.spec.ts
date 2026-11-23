import { Modes } from '@/src/app/models/modes.enum';
import { TestService } from '@/src/app/services/test/test.service';
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
		TestBed.inject(TestService).mode.set(Modes.EDIT);
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('validates the notes length using the test type label', () => {
		const notes = TestBed.inject(TestService).additionalNotesRecorded;
		notes.setValue('a'.repeat(500));
		expect(notes.valid).toBe(true);
		notes.setValue('a'.repeat(501));
		expect(notes.errors).toHaveProperty(
			'maxLength.message',
			'Additional Notes (optional) must be less than or equal to 500 characters'
		);
	});
});
