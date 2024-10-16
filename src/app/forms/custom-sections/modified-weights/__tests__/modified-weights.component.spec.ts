import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { vehicleTemplateMap } from '@forms/utils/tech-record-constants';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { provideMockStore } from '@ngrx/store/testing';
import { initialAppState } from '@store/index';
import { ModifiedWeightsComponent } from '../modified-weights.component';

describe('ModifiedWeightsComponent', () => {
	let component: ModifiedWeightsComponent;
	let fixture: ComponentFixture<ModifiedWeightsComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ModifiedWeightsComponent],
			imports: [HttpClientTestingModule, RouterTestingModule],
			providers: [provideMockStore({ initialState: initialAppState })],
		}).compileComponents();

		fixture = TestBed.createComponent(ModifiedWeightsComponent);
		component = fixture.componentInstance;
		component.changes = {};
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('ngOnInit', () => {
		it('Vehicle type: PSV, Axle changed: Gross. Should determine that only the PSV gross axle have changed', () => {
			component.vehicleType = VehicleTypes.PSV;
			component.changes = {
				techRecord_grossKerbWeight: 1,
				techRecord_grossLadenWeight: 3,
				techRecord_grossGbWeight: 4,
				techRecord_grossDesignWeight: 5,
			};
			fixture.detectChanges();
			component.ngOnInit();

			expect(component.psvGrossAxleChanged).toBe(true);
			expect(component.hgvGrossAxleChanged).toBe(false);
			expect(component.trlGrossAxleChanged).toBe(false);
			expect(component.hgvTrainAxleChanged).toBe(false);
			expect(component.psvTrainAxleChanged).toBe(false);
			expect(component.maxTrainAxleChanged).toBe(false);
		});

		it('Vehicle type: HGV, Axle changed: Gross. Should determine that only the PSV gross axle have changed', () => {
			component.vehicleType = VehicleTypes.HGV;
			component.changes = {
				techRecord_grossGbWeight: 1,
				techRecord_grossEecWeight: 2,
				techRecord_grossDesignWeight: 3,
			};

			fixture.detectChanges();
			component.ngOnInit();

			expect(component.psvGrossAxleChanged).toBe(false);
			expect(component.hgvGrossAxleChanged).toBe(true);
			expect(component.trlGrossAxleChanged).toBe(false);
			expect(component.hgvTrainAxleChanged).toBe(false);
			expect(component.psvTrainAxleChanged).toBe(false);
			expect(component.maxTrainAxleChanged).toBe(false);
		});

		it('Vehicle type: TRL, Axle changed: Gross. Should determine that only the HGV gross axle have changed', () => {
			component.vehicleType = VehicleTypes.TRL;
			component.changes = {
				techRecord_grossGbWeight: 1,
				techRecord_grossEecWeight: 2,
				techRecord_grossDesignWeight: 3,
			};
			fixture.detectChanges();
			component.ngOnInit();

			expect(component.psvGrossAxleChanged).toBe(false);
			expect(component.hgvGrossAxleChanged).toBe(false);
			expect(component.trlGrossAxleChanged).toBe(true);
			expect(component.hgvTrainAxleChanged).toBe(false);
			expect(component.psvTrainAxleChanged).toBe(false);
			expect(component.maxTrainAxleChanged).toBe(false);
		});

		it('Vehicle type: HGV, Axle changed: Gross. Should determine that only the HGV gross axle have changed', () => {
			component.vehicleType = VehicleTypes.HGV;
			component.changes = {
				techRecord_trainGbWeight: 1,
				techRecord_trainEecWeight: 2,
				techRecord_trainDesignWeight: 3,
			};

			fixture.detectChanges();
			component.ngOnInit();

			expect(component.psvGrossAxleChanged).toBe(false);
			expect(component.hgvGrossAxleChanged).toBe(false);
			expect(component.trlGrossAxleChanged).toBe(false);
			expect(component.hgvTrainAxleChanged).toBe(true);
			expect(component.psvTrainAxleChanged).toBe(false);
			expect(component.maxTrainAxleChanged).toBe(false);
		});

		it('Vehicle type: PSV, Axle changed: Train. Should determine that only the PSV train axle have changed', () => {
			component.vehicleType = VehicleTypes.PSV;
			component.changes = {
				techRecord_trainDesignWeight: 1,
				techRecord_maxTrainGbWeight: 3,
			};

			fixture.detectChanges();
			component.ngOnInit();

			expect(component.psvGrossAxleChanged).toBe(false);
			expect(component.hgvGrossAxleChanged).toBe(false);
			expect(component.trlGrossAxleChanged).toBe(false);
			expect(component.hgvTrainAxleChanged).toBe(false);
			expect(component.psvTrainAxleChanged).toBe(true);
			expect(component.maxTrainAxleChanged).toBe(false);
		});

		it('Vehicle type: HGV, Axle changed: Max Train. Should determine that only the HGV max train axle have changed', () => {
			component.vehicleType = VehicleTypes.HGV;
			component.changes = {
				techRecord_maxTrainGbWeight: 1,
				techRecord_maxTrainEecWeight: 2,
				techRecord_maxTrainDesignWeight: 3,
			};

			fixture.detectChanges();
			component.ngOnInit();

			expect(component.psvGrossAxleChanged).toBe(false);
			expect(component.hgvGrossAxleChanged).toBe(false);
			expect(component.trlGrossAxleChanged).toBe(false);
			expect(component.hgvTrainAxleChanged).toBe(false);
			expect(component.psvTrainAxleChanged).toBe(false);
			expect(component.maxTrainAxleChanged).toBe(true);
		});
	});

	describe('getAxleTemplate', () => {
		it('should return the correct template for the vehicle type', () => {
			component.vehicleType = VehicleTypes.HGV;
			fixture.detectChanges();

			const getAxleTemplateSpy = jest.spyOn(component, 'getAxleTemplate');
			const template = component.getAxleTemplate();

			expect(getAxleTemplateSpy).toHaveBeenCalled();
			expect(template).toBeDefined();
			expect(template).toBeInstanceOf(Array);
		});

		it('should return undefined, as an invalid vehicle type has been provided', () => {
			component.vehicleType = '' as VehicleTypes;
			fixture.detectChanges();

			const getAxleTemplateSpy = jest.spyOn(component, 'getAxleTemplate');
			jest.spyOn(vehicleTemplateMap, 'get').mockReturnValue(undefined);
			const template = component.getAxleTemplate();

			expect(getAxleTemplateSpy).toHaveBeenCalled();
			expect(template).toBeUndefined();
		});
	});
});
