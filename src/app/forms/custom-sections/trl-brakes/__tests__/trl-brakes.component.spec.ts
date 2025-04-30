import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideMockStore } from '@ngrx/store/testing';
import { initialAppState } from '@store/index';

import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import {
	TechRecordTRL,
	TechRecordType,
} from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { mockVehicleTechnicalRecord } from '@mocks/mock-vehicle-technical-record.mock';
import { TrlBrakesComponent } from '../trl-brakes.component';

describe('BrakesComponent', () => {
	let component: TrlBrakesComponent;
	let fixture: ComponentFixture<TrlBrakesComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [TrlBrakesComponent],
			providers: [
				provideRouter([]),
				provideHttpClient(),
				provideHttpClientTesting(),
				provideMockStore({ initialState: initialAppState }),
			],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(TrlBrakesComponent);
		component = fixture.componentInstance;
		const techRecord = mockVehicleTechnicalRecord('trl') as TechRecordType<'trl'>;
		techRecord.techRecord_axles = [
			{
				parkingBrakeMrk: true,
				axleNumber: 1,
				brakes_brakeActuator: 1,
				brakes_leverLength: 1,
				brakes_springBrakeParking: true,
				weights_gbWeight: 1,
				weights_designWeight: 2,
				weights_ladenWeight: 3,
				weights_kerbWeight: 4,
				tyres_tyreCode: 1,
				tyres_tyreSize: '2',
				tyres_plyRating: '3',
				tyres_fitmentCode: 'single',
				tyres_dataTrAxles: 1,
				tyres_speedCategorySymbol: 'a7',
			},
			{
				parkingBrakeMrk: true,
				axleNumber: 2,
				brakes_brakeActuator: 1,
				brakes_leverLength: 1,
				brakes_springBrakeParking: false,
				weights_gbWeight: 1,
				weights_designWeight: 2,
				weights_ladenWeight: 3,
				weights_kerbWeight: 4,
				tyres_tyreCode: 1,
				tyres_tyreSize: '2',
				tyres_plyRating: '3',
				tyres_fitmentCode: 'single',
				tyres_dataTrAxles: 1,
				tyres_speedCategorySymbol: 'a7',
			},
			{
				parkingBrakeMrk: false,
				axleNumber: 3,
				brakes_brakeActuator: 1,
				brakes_leverLength: 1,
				brakes_springBrakeParking: true,
				weights_gbWeight: 1,
				weights_designWeight: 2,
				weights_ladenWeight: 3,
				weights_kerbWeight: 4,
				tyres_tyreCode: 1,
				tyres_tyreSize: '2',
				tyres_plyRating: '3',
				tyres_fitmentCode: 'single',
				tyres_dataTrAxles: 1,
				tyres_speedCategorySymbol: 'a7',
			},
		];
		fixture.componentRef.setInput('vehicleTechRecord', techRecord);
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
	describe('The brake code value on this.form', () => {
		it('should match the corresponding values on vehicleTechRecord', () => {
			expect(component.vehicleTechRecord().techRecord_brakes_loadSensingValve).toStrictEqual(
				component.form.value.techRecord_brakes_loadSensingValve
			);
		});
	});
	describe('The dataTrBrakeOne value on this.form', () => {
		it('should match the corresponding values on vehicleTechRecord', () => {
			expect(component.vehicleTechRecord().techRecord_brakes_antilockBrakingSystem).toStrictEqual(
				component.form.value.techRecord_brakes_antilockBrakingSystem
			);
		});
	});

	describe('The axle value on this.form', () => {
		it('should match the corresponding values on vehicleTechRecord', () => {
			const axles = component.vehicleTechRecord().techRecord_axles as NonNullable<TechRecordTRL['techRecord_axles']>;
			expect(axles[0]).toEqual(expect.objectContaining(component.form.controls['techRecord_axles']?.value[0]));
		});
	});
});
