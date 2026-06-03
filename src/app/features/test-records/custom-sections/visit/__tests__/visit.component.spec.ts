import { Modes } from '@/src/app/models/modes.enum';
import { MultiOptionsService } from '@/src/app/services/multi-options/multi-options.service';
import { initialAppState } from '@/src/app/store';
import { testStations } from '@/src/app/store/test-stations';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ControlContainer, FormGroup, FormGroupDirective } from '@angular/forms';
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
					useValue: { getOptions: jest.fn().mockReturnValue(of([])), loadOptions: jest.fn() },
				},
				provideMockStore({ initialState: initialAppState }),
			],
		}).compileComponents();

		store = TestBed.inject(MockStore);
		fixture = TestBed.createComponent(VisitComponent);
		component = fixture.componentInstance;
		fixture.componentRef.setInput('mode', Modes.EDIT);
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('addValidators', () => {
		beforeEach(() => {
			component.addValidators();
		});

		describe('testStationPNumber', () => {
			it('should be invalid when empty', () => {
				const control = component.form.controls.testStationPNumber;
				control.setValue(null);
				control.markAsTouched();
				expect(control.valid).toBe(false);
				expect(control.errors).toHaveProperty('required');
			});

			it('should be valid when a value is provided', () => {
				const control = component.form.controls.testStationPNumber;
				control.setValue('P12345');
				control.markAsTouched();
				expect(control.valid).toBe(true);
			});
		});

		describe('testerStaffId', () => {
			it('should be invalid when empty', () => {
				const control = component.form.controls.testerStaffId;
				control.setValue('');
				control.markAsTouched();
				expect(control.valid).toBe(false);
				expect(control.errors).toHaveProperty('required');
			});

			it('should be valid when a value is provided', () => {
				const control = component.form.controls.testerStaffId;
				control.setValue('STAFF001');
				control.markAsTouched();
				expect(control.valid).toBe(true);
			});
		});
	});

	describe('handleTesterDetailChanges', () => {
		it('should patch tester name and email when testerStaffId changes and user exists', () => {
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

			component.form.controls.testerStaffId.setValue('STAFF001');

			expect(component.form.controls.testerName.value).toBe('John Doe');
			expect(component.form.controls.testerEmailAddress.value).toBe('john@example.com');
		});

		it('should not patch when testerStaffId is empty', () => {
			component.form.controls.testerName.setValue('Existing Name');
			component.form.controls.testerStaffId.setValue('');

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
			component.form.controls.testerStaffId.setValue('UNKNOWN');

			expect(component.form.controls.testerName.value).toBe('Existing Name');
		});
	});

	describe('handleTestStationChanges', () => {
		it('should patch test station type and name when testStationPNumber changes', () => {
			const mockStations = [{ testStationPNumber: 'P123', testStationType: 'atf', testStationName: 'Test Station A' }];
			store.overrideSelector(testStations, mockStations as any);
			store.refreshState();

			component.form.controls.testStationPNumber.setValue('P123');

			expect(component.form.controls.testStationType.value).toBe('atf');
			expect(component.form.controls.testStationName.value).toBe('Test Station A');
		});

		it('should not patch when testStationPNumber is empty', () => {
			component.form.controls.testStationType.setValue('atf' as any);
			component.form.controls.testStationPNumber.setValue('');

			expect(component.form.controls.testStationType.value).toBe('atf');
		});

		it('should not patch when station is not found', () => {
			store.overrideSelector(testStations, []);
			store.refreshState();

			component.form.controls.testStationType.setValue('atf' as any);
			component.form.controls.testStationPNumber.setValue('UNKNOWN');

			expect(component.form.controls.testStationType.value).toBe('atf');
		});
	});

	describe('ngOnDestroy', () => {
		it('should complete the destroy subject', () => {
			const destroySpy = jest.spyOn(component.destroy$, 'complete');
			component.ngOnDestroy();
			expect(destroySpy).toHaveBeenCalled();
		});
	});
});
