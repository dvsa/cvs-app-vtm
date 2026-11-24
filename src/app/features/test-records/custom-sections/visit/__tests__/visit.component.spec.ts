import { Modes } from '@/src/app/models/modes.enum';
import { MultiOptionsService } from '@/src/app/services/multi-options/multi-options.service';
import { initialAppState } from '@/src/app/store';
import { testStations } from '@/src/app/store/test-stations';
import { ComponentFixture, TestBed } from '@angular/core/testing';
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

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [VisitComponent],
			providers: [
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
		const autocomplete: GovukFormGroupAutocompleteComponent = fixture.debugElement.queryAll(
			By.directive(GovukFormGroupAutocompleteComponent)
		)[field === 'testStationPNumber' ? 0 : 1].componentInstance;
		autocomplete.multiOptions = [{ label, value }];
		autocomplete.handleChangeForOption(label);
		fixture.detectChanges();
	};

	describe('validation', () => {
		describe('testStationPNumber', () => {
			it('should be invalid when empty', () => {
				const control = component.form.testStationPNumber;
				control().value.set(null);
				control().markAsTouched();
				expect(control().valid()).toBe(false);
				expect(TestBed.inject(GlobalErrorService).extractSignalFormErrors(component.form)).toContainEqual(
					expect.objectContaining({ error: 'Test Station Details is required', anchorLink: 'testStationPNumber' })
				);
			});

			it('should be valid when a value is provided', () => {
				const control = component.form.testStationPNumber;
				control().value.set('P12345');
				control().markAsTouched();
				expect(control().valid()).toBe(true);
			});

			it('shows the invalid selection message when the autocomplete cannot match the input', () => {
				component.form.testStationPNumber().value.set('[INVALID_OPTION]');
				component.form.testStationPNumber().markAsTouched();
				fixture.detectChanges();

				expect(fixture.nativeElement.querySelector('#testStationPNumber-error')?.textContent).toContain(
					'Test Station Details is invalid'
				);
			});
		});

		describe('testerStaffId', () => {
			it('should be invalid when empty', () => {
				const control = component.form.testerStaffId;
				control().value.set('');
				control().markAsTouched();
				expect(control().valid()).toBe(false);
				expect(TestBed.inject(GlobalErrorService).extractSignalFormErrors(component.form)).toContainEqual(
					expect.objectContaining({ error: 'Tester details is required', anchorLink: 'testerStaffId' })
				);
			});

			it('should be valid when a value is provided', () => {
				const control = component.form.testerStaffId;
				control().value.set('STAFF001');
				control().markAsTouched();
				expect(control().valid()).toBe(true);
			});

			it('shows the invalid selection message when the autocomplete cannot match the input', () => {
				component.form.testerStaffId().value.set('[INVALID_OPTION]');
				component.form.testerStaffId().markAsTouched();
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
			component.testService.patch(savedTester);
			fixture.detectChanges();
			expect(component.testService.value()).toMatchObject(savedTester);

			selectOption('testerStaffId', 'John Doe', 'STAFF001');
			expect(component.testService.value()).toMatchObject({
				testerStaffId: 'STAFF001',
				testerName: 'John Doe',
				testerEmailAddress: 'john@example.com',
			});
		});

		it('should not patch when testerStaffId is empty', () => {
			component.form.testerName().value.set('Existing Name');
			selectOption('testerStaffId', '', '');

			expect(component.form.testerName().value()).toBe('Existing Name');
		});

		it('should not patch when user is not found in store', () => {
			store.setState({
				...initialAppState,
				referenceData: {
					...initialAppState.referenceData,
					USER: { ids: [], entities: {} },
				},
			});

			component.form.testerName().value.set('Existing Name');
			selectOption('testerStaffId', 'Unknown tester', 'UNKNOWN');

			expect(component.form.testerName().value()).toBe('Existing Name');
		});
	});

	describe('station selection', () => {
		it('patches the test station type and name when a station is selected', () => {
			const mockStations = [{ testStationPNumber: 'P123', testStationType: 'atf', testStationName: 'Test Station A' }];
			store.overrideSelector(testStations, mockStations as any);
			store.refreshState();

			selectOption('testStationPNumber', 'Test Station A', 'P123');

			expect(component.testService.value()).toMatchObject({
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
			component.testService.patch({ testStationPNumber: 'P123', testStationName: 'Stored Name' });
			fixture.detectChanges();

			expect(component.form.testStationName().value()).toBe('Stored Name');
		});

		it('should not patch when testStationPNumber is empty', () => {
			component.form.testStationType().value.set('atf' as any);
			selectOption('testStationPNumber', '', '');

			expect(component.form.testStationType().value()).toBe('atf');
		});

		it('should not patch when station is not found', () => {
			store.overrideSelector(testStations, []);
			store.refreshState();

			component.form.testStationType().value.set('atf' as any);
			selectOption('testStationPNumber', 'Unknown station', 'UNKNOWN');

			expect(component.form.testStationType().value()).toBe('atf');
		});
	});

	it.each([Modes.EDIT, Modes.AMEND])('keeps the facility type read-only in %s mode', (mode) => {
		component.testService.mode.set(mode);
		fixture.detectChanges();
		expect(fixture.nativeElement.querySelector('#testStationType')?.disabled).toBe(true);
	});
});
