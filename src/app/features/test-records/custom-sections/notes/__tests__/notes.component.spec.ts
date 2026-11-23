import { Modes } from '@/src/app/models/modes.enum';
import { TestService } from '@/src/app/services/test/test.service';
import { initialAppState } from '@/src/app/store';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ControlContainer, FormGroup, FormGroupDirective } from '@angular/forms';
import { mockTestResult } from '@mocks/mock-test-result';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
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

	it.each([
		[Modes.EDIT, true],
		[Modes.AMEND, true],
		[Modes.VIEW, false],
		[Modes.SUMMARY, false],
	] as const)('shows the notes editor in %s mode: %s', (mode, editing) => {
		component.testService.mode.set(mode);
		fixture.detectChanges();

		expect(!!fixture.nativeElement.querySelector('textarea')).toBe(editing);
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

	it('keeps the displayed label, hint and validation message in sync when the test type changes', () => {
		const store = TestBed.inject(MockStore);
		const testResult = mockTestResult();
		const notes = TestBed.inject(TestService).additionalNotesRecorded;
		notes.setValue('a'.repeat(501));

		store.overrideSelector(toEditOrNotToEdit, {
			...testResult,
			testTypes: [{ ...testResult.testTypes[0], testTypeId: '59', centralDocs: { issueRequired: true } }],
		});
		store.refreshState();
		fixture.detectChanges();

		expect(fixture.nativeElement.textContent).toContain('Additional Notes');
		expect(component.additionalNotesHint()).toBe('Enter a reason for issuing documents centrally');
		expect(notes.errors).toHaveProperty(
			'maxLength.message',
			'Additional Notes must be less than or equal to 500 characters'
		);

		store.overrideSelector(toEditOrNotToEdit, testResult);
		store.refreshState();
		fixture.detectChanges();

		expect(fixture.nativeElement.textContent).toContain('Additional Notes (optional)');
		expect(component.additionalNotesHint()).toBe('');
		expect(notes.errors).toHaveProperty(
			'maxLength.message',
			'Additional Notes (optional) must be less than or equal to 500 characters'
		);
	});
});
