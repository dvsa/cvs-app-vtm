import { initialAppState } from '@/src/app/store';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ChangeDetectorRef, ComponentRef } from '@angular/core';
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
import { mockVehicleTechnicalRecord } from '@mocks/mock-vehicle-technical-record.mock';
import { ReferenceDataModelBase, ReferenceDataResourceType } from '@models/reference-data.model';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MultiOptionsService } from '@services/multi-options/multi-options.service';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { STORE_FEATURE_REFERENCE_DATA_KEY, selectReferenceDataByResourceKey } from '@store/reference-data';
import { updateEditingTechRecord } from '@store/technical-records';
import { ReplaySubject, of } from 'rxjs';
import { BrakesComponent } from '../brakes.component';

describe('BrakesComponent', () => {
	let controlContainer: ControlContainer;
	let component: BrakesComponent;
	let componentRef: ComponentRef<BrakesComponent>;
	let fixture: ComponentFixture<BrakesComponent>;
	let formGroupDirective: FormGroupDirective;
	let store: MockStore;
	let optionsService: MultiOptionsService;

	const mockTRL = mockVehicleTechnicalRecord('trl');
	const mockPSV = mockVehicleTechnicalRecord('psv');
	const actions$ = new ReplaySubject<Action>();

	beforeEach(async () => {
		formGroupDirective = new FormGroupDirective([], []);
		formGroupDirective.form = new FormGroup<Partial<Record<keyof TechRecordType<'psv' | 'trl'>, FormControl>>>({});

		await TestBed.configureTestingModule({
			imports: [FormsModule, ReactiveFormsModule, BrakesComponent],
			providers: [
				provideMockStore({ initialState: initialAppState }),
				provideHttpClient(),
				provideHttpClientTesting(),
				provideMockActions(() => actions$),
				TechnicalRecordService,
				ChangeDetectorRef,
				{ provide: ControlContainer, useValue: formGroupDirective },
				{
					provide: MultiOptionsService,
					useValue: {
						getOptions: jest.fn().mockImplementation(() => of([{ value: 'brake1', label: 'brake1' }])),
						loadOptions: jest.fn(),
					},
				},
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

		store = TestBed.inject(MockStore);
		controlContainer = TestBed.inject(ControlContainer);
		optionsService = TestBed.inject(MultiOptionsService);

		fixture = TestBed.createComponent(BrakesComponent);
		component = fixture.componentInstance;
		componentRef = fixture.componentRef;
		componentRef.setInput('techRecord', mockPSV);
		component.form.reset();
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('ngOnInit', () => {
		it('should attach all form controls to parent', () => {
			const parent = controlContainer.control as FormGroup;
			component.ngOnInit();
			expect(Object.keys(parent.controls)).toEqual(Object.keys(component.form.controls));
		});

		it('should call loadOptions', () => {
			const loadOptionsSpy = jest.spyOn(optionsService, 'loadOptions');
			component.ngOnInit();
			expect(loadOptionsSpy).toHaveBeenCalled();
		});

		it('should call handleBrakeCodeChange', () => {
			const handleBrakeCodeChangeSpy = jest.spyOn(component, 'handleBrakeCodeChange');
			component.ngOnInit();
			expect(handleBrakeCodeChangeSpy).toHaveBeenCalled();
		});
	});

	describe('ngOnDestroy', () => {
		it('should detach all form controls from parent', () => {
			const parent = controlContainer.control as FormGroup;
			component.ngOnDestroy();
			expect(Object.keys(parent.controls)).toEqual([]);
		});

		it('should complete destroy$ subject', () => {
			const completeSpy = jest.spyOn(component.destroy$, 'complete');
			component.ngOnDestroy();
			expect(completeSpy).toHaveBeenCalled();
		});

		it('should emit true to destroy$ subject', () => {
			let emittedValue: boolean | undefined;
			component.destroy$.subscribe((value) => (emittedValue = value));
			component.ngOnDestroy();
			expect(emittedValue).toBe(true);
		});
	});

	describe('brakeCodePrefix', () => {
		it('should return an empty string if vehicle is not a PSV ', () => {
			const trlRecord = mockVehicleTechnicalRecord('trl');
			componentRef.setInput('techRecord', trlRecord);
			expect(component.brakeCodePrefix).toBe('');
		});
		it('should return an empty string if grossLadenWeight is a falsy value', () => {
			const psvRecord = mockVehicleTechnicalRecord('psv');
			(psvRecord as TechRecordType<'psv'>).techRecord_grossLadenWeight = null;
			componentRef.setInput('techRecord', psvRecord);
			expect(component.brakeCodePrefix).toBe('');
		});
		it('should return the without a leading zero if the prefix length is over 2', () => {
			const psvRecord = mockVehicleTechnicalRecord('psv');
			(psvRecord as TechRecordType<'psv'>).techRecord_grossLadenWeight = 10000;
			componentRef.setInput('techRecord', psvRecord);
			expect(component.brakeCodePrefix).toBe('100');
		});
		it('should return the with a leading zero if the prefix length is equal or under 2', () => {
			const psvRecord = mockVehicleTechnicalRecord('psv');
			(psvRecord as TechRecordType<'psv'>).techRecord_grossLadenWeight = 1970;
			componentRef.setInput('techRecord', psvRecord);
			expect(component.brakeCodePrefix).toBe('020');
		});
	});
	describe('round', () => {
		it('should round a number to the nearest integer', () => {
			const value = component.round(6.7);
			expect(value).toBe(7);
		});

		it('should round a number to the nearest integer (down)', () => {
			const value = component.round(6.3);
			expect(value).toBe(6);
		});

		it('should round a negative number to the nearest integer', () => {
			const value = component.round(-6.7);
			expect(value).toBe(-7);
		});

		it('should round a negative number to the nearest integer (up)', () => {
			const value = component.round(-6.3);
			expect(value).toBe(-6);
		});
	});

	describe('handleBrakeCodeChange', () => {
		it('should early return for vehicles other than PSV', () => {
			store
				.select(selectReferenceDataByResourceKey(ReferenceDataResourceType.Brakes, '1234'))
				.subscribe((value: ReferenceDataModelBase) => {
					const spy = jest.spyOn(component.form, 'get');
					fixture.componentRef.setInput('techRecord', mockTRL);
					component.handleBrakeCodeChange();
					expect(spy).not.toHaveBeenCalled();
				});
		});

		it('should dispatch updateEditingTechRecord with calculated values when the brake code value changes', () => {
			jest.useFakeTimers();

			const brakesData = {
				resourceKey: '123',
				resourceType: ReferenceDataResourceType.Brakes,
				service: '123',
				secondary: '123',
				parking: '123',
			};

			const changes = {
				techRecord_brakeCode: '00123',
				techRecord_brakes_brakeCode: '00123',
				techRecord_brakes_dataTrBrakeOne: brakesData.service,
				techRecord_brakes_dataTrBrakeTwo: brakesData.secondary,
				techRecord_brakes_dataTrBrakeThree: brakesData.parking,
			};

			const dispatchSpy = jest.spyOn(store, 'dispatch');

			store.setState({
				...initialAppState,
				[STORE_FEATURE_REFERENCE_DATA_KEY]: {
					...initialAppState.referenceData,
					[ReferenceDataResourceType.Brakes]: {
						ids: [brakesData.resourceKey],
						entities: { [brakesData.resourceKey]: brakesData },
					},
				},
			});

			fixture.componentRef.setInput('techRecord', mockPSV);
			store
				.select(selectReferenceDataByResourceKey(ReferenceDataResourceType.Brakes, '1234'))
				.subscribe((value: ReferenceDataModelBase) => {
					component.handleBrakeCodeChange();
					component.form.patchValue({
						techRecord_brakes_brakeCodeOriginal: '123',
					});

					jest.advanceTimersByTime(401);

					expect(dispatchSpy).toHaveBeenNthCalledWith(
						1,
						updateEditingTechRecord({ vehicleTechRecord: changes } as any)
					);
				});
		});
	});
});
