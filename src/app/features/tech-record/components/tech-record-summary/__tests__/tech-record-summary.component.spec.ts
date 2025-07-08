import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { EUVehicleCategory } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/euVehicleCategoryTrl.enum.js';
import { TechRecordType as TechRecordTypeByVehicle } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { LettersComponent } from '@forms/custom-sections/letters/letters.component';
import { Roles } from '@models/roles.enum';
import { FitmentCode, SpeedCategorySymbol, V3TechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { FeatureToggleService } from '@services/feature-toggle-service/feature-toggle-service';
import { MultiOptionsService } from '@services/multi-options/multi-options.service';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { UserService } from '@services/user-service/user-service';
import { State, initialAppState } from '@store/index';
import { updateEditingTechRecord } from '@store/technical-records';
import { of } from 'rxjs';
import { TechRecordSummaryComponent } from '../tech-record-summary.component';

global.scrollTo = jest.fn();

describe('TechRecordSummaryComponent', () => {
	let component: TechRecordSummaryComponent;
	let fixture: ComponentFixture<TechRecordSummaryComponent>;
	let store: MockStore<State>;
	let techRecordService: TechnicalRecordService;
	let featureToggleService: FeatureToggleService;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [TechRecordSummaryComponent],
			providers: [
				MultiOptionsService,
				provideRouter([]),
				provideHttpClient(),
				provideHttpClientTesting(),
				provideMockStore({ initialState: initialAppState }),
				{
					provide: UserService,
					useValue: {
						roles$: of([Roles.TechRecordAmend]),
					},
				},
				TechnicalRecordService,
				FeatureToggleService,
			],
		})
			.overrideComponent(LettersComponent, {
				set: {
					selector: 'app-letters',
					template: '<p>Mock Letters Component</p>',
				},
			})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(TechRecordSummaryComponent);
		store = TestBed.inject(MockStore);
		techRecordService = TestBed.inject(TechnicalRecordService);
		featureToggleService = TestBed.inject(FeatureToggleService);
		component = fixture.componentInstance;
		fixture.componentRef.setInput('isCreateMode', false);
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	function checkHeading(): void {
		const heading = fixture.debugElement.query(By.css('.govuk-heading-s'));
		expect(heading).toBeFalsy();
	}

	describe('TechRecordSummaryComponent View', () => {
		it('should show PSV record found', () => {
			component.isEditing = false;
			techRecordService.techRecord$ = of({
				systemNumber: 'foo',
				createdTimestamp: 'bar',
				vin: 'testVin',
				techRecord_vehicleType: VehicleTypes.PSV,
			} as V3TechRecordModel);
			fixture.detectChanges();
			component.ngOnInit();
			checkHeading();
			expect(component.vehicleType).toEqual(VehicleTypes.PSV);
		});

		it('should show PSV record found without dimensions', () => {
			component.isEditing = false;
			techRecordService.techRecord$ = of({
				systemNumber: 'foo',
				createdTimestamp: 'bar',
				vin: 'testVin',
				techRecord_vehicleType: VehicleTypes.PSV,
			} as V3TechRecordModel);
			component.ngOnInit();
			fixture.detectChanges();

			checkHeading();
			expect(
				(component.techRecordCalculated as TechRecordTypeByVehicle<'psv'>).techRecord_dimensions_height
			).toBeUndefined();
		});

		it('should show HGV record found', () => {
			component.isEditing = false;
			techRecordService.techRecord$ = of({
				systemNumber: 'foo',
				createdTimestamp: 'bar',
				vin: 'testVin',
				techRecord_vehicleType: VehicleTypes.HGV,
			} as V3TechRecordModel);
			component.ngOnInit();
			fixture.detectChanges();

			checkHeading();
			expect(component.vehicleType).toEqual(VehicleTypes.HGV);
		});

		it('should show HGV record found without dimensions', () => {
			component.isEditing = false;
			techRecordService.techRecord$ = of({
				systemNumber: 'foo',
				createdTimestamp: 'bar',
				vin: 'testVin',
				techRecord_vehicleType: VehicleTypes.HGV,
			} as V3TechRecordModel);
			component.ngOnInit();
			fixture.detectChanges();

			checkHeading();
			expect(component.vehicleType).toEqual(VehicleTypes.HGV);
		});

		it('should show TRL record found', () => {
			component.isEditing = false;
			techRecordService.techRecord$ = of({
				systemNumber: 'foo',
				createdTimestamp: 'bar',
				vin: 'testVin',
				techRecord_vehicleType: VehicleTypes.TRL,
				techRecord_euVehicleCategory: EUVehicleCategory.O2,
			} as V3TechRecordModel);
			component.ngOnInit();
			fixture.detectChanges();

			checkHeading();
			expect(component.vehicleType).toEqual(VehicleTypes.SMALL_TRL);
		});

		it('should show TRL record found without dimensions', () => {
			component.isEditing = false;
			techRecordService.techRecord$ = of({
				systemNumber: 'foo',
				createdTimestamp: 'bar',
				vin: 'testVin',
				techRecord_vehicleType: VehicleTypes.TRL,
			} as V3TechRecordModel);

			component.ngOnInit();
			fixture.detectChanges();

			checkHeading();
			expect(component.vehicleType).toEqual(VehicleTypes.TRL);
		});
	});

	describe('handleFormState', () => {
		it('should dispatch updateEditingTechRecord', () => {
			jest.spyOn(component, 'checkForms').mockImplementation();
			const dispatchSpy = jest.spyOn(store, 'dispatch');
			const mockTechRecord = {
				systemNumber: 'foo',
				createdTimestamp: 'bar',
				vin: 'testVin',
				techRecord_vehicleType: VehicleTypes.LGV,
			} as unknown as TechRecordType<'put'>;
			component.techRecordCalculated = mockTechRecord;
			jest.spyOn(store, 'select').mockReturnValue(of(mockTechRecord));
			jest.spyOn(component, 'sections').mockReturnValue([]);

			component.handleFormState({});

			expect(dispatchSpy).toHaveBeenCalledWith(updateEditingTechRecord({ vehicleTechRecord: mockTechRecord }));
		});
	});

	describe('getAxleErrors', () => {
		it('should return an error if PSV has only one axle', () => {
			const mockTechRecord = {
				systemNumber: 'foo',
				createdTimestamp: 'bar',
				vin: 'testVin',
				techRecord_vehicleType: VehicleTypes.PSV,
				techRecord_axles: [
					{
						axleNumber: 1,
						tyres_dataTrAxles: 1,
						tyres_fitmentCode: FitmentCode.SINGLE,
						tyres_speedCategorySymbol: SpeedCategorySymbol.A7,
						weights_gbWeight: 1000,
						weights_eecWeight: 1000,
						weights_designWeight: 1000,
					},
				],
			} as unknown as TechRecordType<'put'>;
			jest.spyOn(component.form, 'getRawValue').mockReturnValue(mockTechRecord);

			const errors = component.getAxleErrors();

			expect(errors).toEqual([
				{ error: 'You cannot submit a PSV with less than 2 axles', anchorLink: 'weightsAddAxle' },
			]);
		});

		it('should return an error if HGV has only one axle', () => {
			const mockTechRecord = {
				systemNumber: 'foo',
				createdTimestamp: 'bar',
				vin: 'testVin',
				techRecord_vehicleType: VehicleTypes.HGV,
				techRecord_axles: [
					{
						axleNumber: 1,
						tyres_dataTrAxles: 1,
						tyres_fitmentCode: FitmentCode.SINGLE,
						tyres_speedCategorySymbol: SpeedCategorySymbol.A7,
						weights_gbWeight: 1000,
						weights_eecWeight: 1000,
						weights_designWeight: 1000,
					},
				],
			} as unknown as TechRecordType<'put'>;
			component.techRecordCalculated = mockTechRecord;
			jest.spyOn(component.form, 'getRawValue').mockReturnValue(mockTechRecord);

			const errors = component.getAxleErrors();

			expect(errors).toEqual([
				{ error: 'You cannot submit a HGV with less than 2 axles', anchorLink: 'weightsAddAxle' },
			]);
		});

		it('should return an empty array if PSV has two or more axles', () => {
			const mockTechRecord = {
				systemNumber: 'foo',
				createdTimestamp: 'bar',
				vin: 'testVin',
				techRecord_vehicleType: VehicleTypes.PSV,
				techRecord_axles: [
					{
						axleNumber: 1,
						tyres_dataTrAxles: 1,
						tyres_fitmentCode: FitmentCode.SINGLE,
						tyres_speedCategorySymbol: SpeedCategorySymbol.A7,
						weights_gbWeight: 1000,
						weights_eecWeight: 1000,
						weights_designWeight: 1000,
					},
					{
						axleNumber: 2,
						tyres_dataTrAxles: 1,
						tyres_fitmentCode: FitmentCode.SINGLE,
						tyres_speedCategorySymbol: SpeedCategorySymbol.A7,
						weights_gbWeight: 1000,
						weights_eecWeight: 1000,
						weights_designWeight: 1000,
					},
				],
			} as unknown as TechRecordType<'put'>;
			jest.spyOn(component.form, 'getRawValue').mockReturnValue(mockTechRecord);

			const errors = component.getAxleErrors();

			expect(errors).toEqual([]);
		});
	});
});
