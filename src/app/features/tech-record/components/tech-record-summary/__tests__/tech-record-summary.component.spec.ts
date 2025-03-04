import { HttpClientTestingModule } from '@angular/common/http/testing';
import { QueryList } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { EUVehicleCategory } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/euVehicleCategoryTrl.enum.js';
import { TechRecordType as TechRecordTypeByVehicle } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { DynamicFormGroupComponent } from '@forms/components/dynamic-form-group/dynamic-form-group.component';
import { LettersComponent } from '@forms/custom-sections/letters/letters.component';
import { DynamicFormsModule } from '@forms/dynamic-forms.module';
import { Roles } from '@models/roles.enum';
import { V3TechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { FeatureToggleService } from '@services/feature-toggle-service/feature-toggle-service';
import { MultiOptionsService } from '@services/multi-options/multi-options.service';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { UserService } from '@services/user-service/user-service';
import { SharedModule } from '@shared/shared.module';
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
			declarations: [TechRecordSummaryComponent],
			imports: [DynamicFormsModule, HttpClientTestingModule, RouterTestingModule, SharedModule],
			providers: [
				MultiOptionsService,
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
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	function checkHeadingAndForm(): void {
		const heading = fixture.debugElement.query(By.css('.govuk-heading-s'));
		expect(heading).toBeFalsy();

		const form = fixture.nativeElement.querySelector('app-dynamic-form-group');
		expect(form).toBeTruthy();
	}

	describe('TechRecordSummaryComponent View', () => {
		it('should show PSV record found', () => {
			component.isEditing = false;
			jest.spyOn(techRecordService, 'techRecord$', 'get').mockReturnValue(
				of({
					systemNumber: 'foo',
					createdTimestamp: 'bar',
					vin: 'testVin',
					techRecord_vehicleType: VehicleTypes.PSV,
				} as V3TechRecordModel)
			);
			fixture.detectChanges();
			checkHeadingAndForm();
			expect(component.vehicleType).toEqual(VehicleTypes.PSV);
		});

		it('should show PSV record found without dimensions', () => {
			component.isEditing = false;
			jest.spyOn(techRecordService, 'techRecord$', 'get').mockReturnValue(
				of({
					systemNumber: 'foo',
					createdTimestamp: 'bar',
					vin: 'testVin',
					techRecord_vehicleType: VehicleTypes.PSV,
				} as V3TechRecordModel)
			);
			fixture.detectChanges();

			checkHeadingAndForm();
			expect(
				(component.techRecordCalculated as TechRecordTypeByVehicle<'psv'>).techRecord_dimensions_height
			).toBeUndefined();
		});

		it('should show HGV record found', () => {
			component.isEditing = false;
			jest.spyOn(techRecordService, 'techRecord$', 'get').mockReturnValue(
				of({
					systemNumber: 'foo',
					createdTimestamp: 'bar',
					vin: 'testVin',
					techRecord_vehicleType: VehicleTypes.HGV,
				} as V3TechRecordModel)
			);
			fixture.detectChanges();

			checkHeadingAndForm();
			expect(component.vehicleType).toEqual(VehicleTypes.HGV);
		});

		it('should show HGV record found without dimensions', () => {
			component.isEditing = false;
			jest.spyOn(techRecordService, 'techRecord$', 'get').mockReturnValue(
				of({
					systemNumber: 'foo',
					createdTimestamp: 'bar',
					vin: 'testVin',
					techRecord_vehicleType: VehicleTypes.HGV,
				} as V3TechRecordModel)
			);
			fixture.detectChanges();

			checkHeadingAndForm();
			expect(component.vehicleType).toEqual(VehicleTypes.HGV);
		});

		it('should show TRL record found', () => {
			component.isEditing = false;
			jest.spyOn(techRecordService, 'techRecord$', 'get').mockReturnValue(
				of({
					systemNumber: 'foo',
					createdTimestamp: 'bar',
					vin: 'testVin',
					techRecord_vehicleType: VehicleTypes.TRL,
					techRecord_euVehicleCategory: EUVehicleCategory.O2,
				} as V3TechRecordModel)
			);
			fixture.detectChanges();

			checkHeadingAndForm();
			expect(component.vehicleType).toEqual(VehicleTypes.SMALL_TRL);
		});

		it('should show TRL record found without dimensions', () => {
			component.isEditing = false;
			jest.spyOn(techRecordService, 'techRecord$', 'get').mockReturnValue(
				of({
					systemNumber: 'foo',
					createdTimestamp: 'bar',
					vin: 'testVin',
					techRecord_vehicleType: VehicleTypes.TRL,
				} as V3TechRecordModel)
			);
			fixture.detectChanges();

			checkHeadingAndForm();
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
			component.sections = new QueryList<DynamicFormGroupComponent>();

			component.handleFormState({});

			expect(dispatchSpy).toHaveBeenCalledWith(updateEditingTechRecord({ vehicleTechRecord: mockTechRecord }));
		});
	});
});
