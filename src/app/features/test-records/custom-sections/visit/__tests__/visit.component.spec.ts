import { Modes } from '@/src/app/models/modes.enum';
import { MultiOptionsService } from '@/src/app/services/multi-options/multi-options.service';
import { initialAppState } from '@/src/app/store';
import { testStations } from '@/src/app/store/test-stations';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ControlContainer, FormGroup, FormGroupDirective } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { GovukFormGroupAutocompleteComponent } from '@forms/components/govuk-form-group-autocomplete/govuk-form-group-autocomplete.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { VisitComponent } from '../visit.component';

describe('VisitComponent', () => {
	let fixture: ComponentFixture<VisitComponent>;
	let component: VisitComponent;
	let store: MockStore;
	let formGroupDirective: FormGroupDirective;

	beforeEach(async () => {
		formGroupDirective = new FormGroupDirective([], []);
		formGroupDirective.form = new FormGroup({});

		await TestBed.configureTestingModule({
			imports: [VisitComponent],
			providers: [
				{ provide: ControlContainer, useValue: formGroupDirective },
				{
					provide: MultiOptionsService,
					useValue: { getOptions: vi.fn().mockReturnValue(of([])), loadOptions: vi.fn() },
				},
				provideMockStore({ initialState: initialAppState }),
			],
		}).compileComponents();

		store = TestBed.inject(MockStore);
		fixture = TestBed.createComponent(VisitComponent);
		component = fixture.componentInstance;
		component.testService.mode.set(Modes.EDIT);
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	const selectOption = (field: 'testerStaffId' | 'testStationPNumber', label: string, value: string) => {
		const autocomplete: GovukFormGroupAutocompleteComponent = fixture.debugElement.query(
			By.css(`[formControlName="${field}"]`)
		).componentInstance;
		autocomplete.multiOptions = [{ label, value }];
		autocomplete.handleChangeForOption(label);
		fixture.detectChanges();
	};

	describe('validation', () => {
		describe('testStationPNumber', () => {
			it('should be invalid when empty', () => {
				const control = component.form.controls.testStationPNumber;
				control.setValue(null);
				control.markAsTouched();
				expect(control.valid).toBe(false);
				expect(TestBed.inject(GlobalErrorService).extractGlobalErrors(component.form)).toContainEqual(
					expect.objectContaining({ error: 'Test Station Details is required', anchorLink: 'testStationPNumber' })
				);
			});

			it('should be valid when a value is provided', () => {
				const control = component.form.controls.testStationPNumber;
				control.setValue('P12345');
				control.markAsTouched();
				expect(control.valid).toBe(true);
			});

			it('shows the invalid selection message when the autocomplete cannot match the input', () => {
				component.form.controls.testStationPNumber.setValue('[INVALID_OPTION]');
				component.form.controls.testStationPNumber.markAsTouched();
				fixture.detectChanges();

				expect(fixture.nativeElement.querySelector('#testStationPNumber-error')?.textContent).toContain(
					'Test Station Details is invalid'
				);
			});
		});

		describe('testerStaffId', () => {
			it('should be invalid when empty', () => {
				const control = component.form.controls.testerStaffId;
				control.setValue('');
				control.markAsTouched();
				expect(control.valid).toBe(false);
				expect(TestBed.inject(GlobalErrorService).extractGlobalErrors(component.form)).toContainEqual(
					expect.objectContaining({ error: 'Tester details is required', anchorLink: 'testerStaffId' })
				);
			});

			it('should be valid when a value is provided', () => {
				const control = component.form.controls.testerStaffId;
				control.setValue('STAFF001');
				control.markAsTouched();
				expect(control.valid).toBe(true);
			});

			it('shows the invalid selection message when the autocomplete cannot match the input', () => {
				component.form.controls.testerStaffId.setValue('[INVALID_OPTION]');
				component.form.controls.testerStaffId.markAsTouched();
				fixture.detectChanges();

				expect(fixture.nativeElement.querySelector('#testerStaffId-error')?.textContent).toContain(
					'Tester details is invalid'
				);
			});
		});
	});

	describe('tester selection', () => {
		it('preserves saved details on load and updates them when a tester is selected', () => {
			store.setState({
				...initialAppState,
				referenceData: {
					...initialAppState.referenceData,
					USER: {
						ids: ['STAFF001'],
						entities: { STAFF001: { name: 'John Doe', email: 'john@example.com', resourceKey: 'STAFF001' } },
					},
				},
			});

			const savedTester = {
				testerStaffId: 'STAFF001',
				testerName: 'Saved Name',
				testerEmailAddress: 'saved@example.com',
			};
			component.form.patchValue(savedTester);
			fixture.detectChanges();
			expect(component.form.getRawValue()).toMatchObject(savedTester);

			selectOption('testerStaffId', 'John Doe', 'STAFF001');
			expect(component.form.getRawValue()).toMatchObject({
				testerStaffId: 'STAFF001',
				testerName: 'John Doe',
				testerEmailAddress: 'john@example.com',
			});
		});

		it('should not patch when testerStaffId is empty', () => {
			component.form.controls.testerName.setValue('Existing Name');
			selectOption('testerStaffId', '', '');

			expect(component.form.controls.testerName.value).toBe('Existing Name');
		});

		it('should not patch when user is not found in store', () => {
			store.setState({
				...initialAppState,
				referenceData: {
					...initialAppState.referenceData,
					USER: { ids: [], entities: {} },
				},
			});

			component.form.controls.testerName.setValue('Existing Name');
			selectOption('testerStaffId', 'Unknown tester', 'UNKNOWN');

			expect(component.form.controls.testerName.value).toBe('Existing Name');
		});
	});

	describe('station selection', () => {
		it('patches the test station type and name when a station is selected', () => {
			const mockStations = [{ testStationPNumber: 'P123', testStationType: 'atf', testStationName: 'Test Station A' }];
			store.overrideSelector(testStations, mockStations as any);
			store.refreshState();

			selectOption('testStationPNumber', 'Test Station A', 'P123');

			expect(component.form.getRawValue()).toMatchObject({
				testStationPNumber: 'P123',
				testStationType: 'atf',
				testStationName: 'Test Station A',
			});
		});

		it('keeps the station details from an existing result until the user edits the selection', () => {
			store.overrideSelector(testStations, [
				{ testStationPNumber: 'P123', testStationType: 'atf', testStationName: 'Current Name' },
			] as ReturnType<typeof testStations>);
			store.refreshState();
			component.form.patchValue({ testStationPNumber: 'P123', testStationName: 'Stored Name' });
			fixture.detectChanges();

			expect(component.form.controls.testStationName.value).toBe('Stored Name');
		});

		it('should not patch when testStationPNumber is empty', () => {
			component.form.controls.testStationType.setValue('atf' as any);
			selectOption('testStationPNumber', '', '');

			expect(component.form.controls.testStationType.value).toBe('atf');
		});

		it('should not patch when station is not found', () => {
			store.overrideSelector(testStations, []);
			store.refreshState();

			component.form.controls.testStationType.setValue('atf' as any);
			selectOption('testStationPNumber', 'Unknown station', 'UNKNOWN');

			expect(component.form.controls.testStationType.value).toBe('atf');
		});
	});

	it.each([Modes.EDIT, Modes.AMEND])('keeps the facility type read-only in %s mode', (mode) => {
		component.testService.mode.set(mode);
		fixture.detectChanges();
		expect(fixture.nativeElement.querySelector('#testStationType')?.disabled).toBe(true);
	});
});
