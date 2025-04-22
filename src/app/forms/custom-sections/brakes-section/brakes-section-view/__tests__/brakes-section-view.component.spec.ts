import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideRouter } from '@angular/router';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { BrakesSectionViewComponent } from '@forms/custom-sections/brakes-section/brakes-section-view/brakes-section-view.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { initialAppState } from '@store/index';
import { techRecord } from '@store/technical-records';

describe('BrakesSectionViewComponent', () => {
	let component: BrakesSectionViewComponent;
	let fixture: ComponentFixture<BrakesSectionViewComponent>;
	let store: MockStore;

	const mockTRL: TechRecordType<'trl'> = {
		techRecord_axles: [],
		createdTimestamp: '',
		partialVin: '555',
		systemNumber: '321',
		techRecord_bodyType_code: '',
		techRecord_bodyType_description: '',
		techRecord_couplingCenterToRearAxleMax: 0,
		techRecord_couplingCenterToRearAxleMin: 0,
		techRecord_couplingCenterToRearTrlMax: 0,
		techRecord_couplingCenterToRearTrlMin: 0,
		techRecord_couplingType: '',
		techRecord_createdAt: '',
		techRecord_createdById: '',
		techRecord_createdByName: '',
		techRecord_dimensions_length: 0,
		techRecord_dimensions_width: 0,
		techRecord_euVehicleCategory: undefined,
		techRecord_firstUseDate: '',
		techRecord_frontAxleToRearAxle: 0,
		techRecord_make: '',
		techRecord_maxLoadOnCoupling: 0,
		techRecord_model: '',
		techRecord_noOfAxles: 0,
		techRecord_notes: '',
		techRecord_rearAxleToRearTrl: 0,
		techRecord_reasonForCreation: '',
		techRecord_roadFriendly: false,
		techRecord_statusCode: 'current',
		techRecord_suspensionType: '',
		techRecord_tyreUseCode: undefined,
		techRecord_vehicleClass_code: 't',
		techRecord_vehicleClass_description: 'trailer',
		techRecord_vehicleConfiguration: undefined,
		techRecord_vehicleType: 'trl',
		trailerId: '',
		vin: '',
	};

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [FormsModule, BrakesSectionViewComponent, ReactiveFormsModule],
			providers: [
				provideMockStore({ initialState: initialAppState }),
				provideRouter([]),
				provideHttpClient(),
				provideHttpClientTesting(),
			],
		}).compileComponents();
		store = TestBed.inject(MockStore);
		fixture = TestBed.createComponent(BrakesSectionViewComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();

		store.overrideSelector(techRecord, mockTRL);
	});

	it('should create', () => {
		expect(component).toBeTruthy();
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
});
