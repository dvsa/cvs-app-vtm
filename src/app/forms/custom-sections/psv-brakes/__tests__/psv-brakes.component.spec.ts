import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideRouter } from '@angular/router';
import {
	TechRecordPSV,
	TechRecordType,
} from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';

import { mockVehicleTechnicalRecord } from '@mocks/mock-vehicle-technical-record.mock';
import { provideMockStore } from '@ngrx/store/testing';
import { MultiOptionsService } from '@services/multi-options/multi-options.service';
import { ReferenceDataService } from '@services/reference-data/reference-data.service';
import { UserService } from '@services/user-service/user-service';
import { initialAppState } from '@store/index';
import { PsvBrakesComponent } from '../psv-brakes.component';

describe('PsvBrakesComponent', () => {
	let component: PsvBrakesComponent;
	let fixture: ComponentFixture<PsvBrakesComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [FormsModule, PsvBrakesComponent, ReactiveFormsModule],
			providers: [
				MultiOptionsService,
				provideRouter([]),
				provideHttpClient(),
				provideHttpClientTesting(),
				provideMockStore({ initialState: initialAppState }),
				ReferenceDataService,
				{ provide: UserService, useValue: {} },
			],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(PsvBrakesComponent);
		component = fixture.componentInstance;

		const techRecord = mockVehicleTechnicalRecord('psv') as TechRecordType<'psv'>;
		techRecord.techRecord_axles = [
			{
				axleNumber: 1,
				tyres_tyreSize: '295/80-22.5',
				tyres_speedCategorySymbol: 'p',
				tyres_fitmentCode: 'double',
				tyres_dataTrAxles: 0,
				tyres_plyRating: 'A',
				tyres_tyreCode: 456,
				parkingBrakeMrk: false,

				weights_kerbWeight: 1,
				weights_ladenWeight: 2,
				weights_gbWeight: 3,
				// TODO: V3 2 eecweights in type package, which is this?
				// weights_eecWeight: 4,
				weights_designWeight: 5,
			},
			{
				axleNumber: 2,
				parkingBrakeMrk: true,

				tyres_tyreSize: '295/80-22.5',
				tyres_speedCategorySymbol: 'p',
				tyres_fitmentCode: 'double',
				tyres_dataTrAxles: 0,
				tyres_plyRating: 'A',
				tyres_tyreCode: 456,

				weights_kerbWeight: 1,
				weights_ladenWeight: 2,
				weights_gbWeight: 3,
				// weights_eecWeight: 4,
				weights_designWeight: 5,
			},
			{
				axleNumber: 3,
				parkingBrakeMrk: true,

				tyres_tyreSize: '295/80-22.5',
				tyres_speedCategorySymbol: 'p',
				tyres_fitmentCode: 'double',
				tyres_dataTrAxles: 0,
				tyres_plyRating: 'A',
				tyres_tyreCode: 456,

				weights_kerbWeight: 1,
				weights_ladenWeight: 2,
				weights_gbWeight: 3,
				// weights_eecWeight: 4,
				weights_designWeight: 5,
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
			expect(component.vehicleTechRecord()?.techRecord_brakes_brakeCode).toStrictEqual(
				component.form.value.techRecord_brakes_brakeCode
			);
		});
	});
	describe('The dataTrBrakeOne value on this.form', () => {
		it('should match the corresponding values on vehicleTechRecord', () => {
			expect(component.vehicleTechRecord()?.techRecord_brakes_retarderBrakeOne).toStrictEqual(
				component.form.value.techRecord_brakes_retarderBrakeOne
			);
		});
	});
	describe('The brakeCodeOriginal value on this.form', () => {
		it('should match the corresponding values on vehicleTechRecord', () => {
			expect(component.vehicleTechRecord()?.techRecord_brakes_brakeCodeOriginal).toStrictEqual(
				component.form.controls['techRecord_brakes_brakeCodeOriginal']?.value
			);
		});
	});

	describe('The axle value on this.form', () => {
		it('should match the corresponding values on vehicleTechRecord', () => {
			const axles = component.vehicleTechRecord()?.techRecord_axles as NonNullable<TechRecordPSV['techRecord_axles']>;
			expect(axles[0]).toEqual(expect.objectContaining(component.form.controls['techRecord_axles']?.value[0]));
		});
	});
});
