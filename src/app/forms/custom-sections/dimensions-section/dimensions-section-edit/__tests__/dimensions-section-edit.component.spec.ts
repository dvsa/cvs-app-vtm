import { TestBed } from '@angular/core/testing';
import { ControlContainer, FormArray, FormGroup } from '@angular/forms';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { initialAppState } from '@store/index';
import { of } from 'rxjs';
import { DimensionsSectionEditComponent } from '../dimensions-section-edit.component';

describe('DimensionsSectionEditComponent', () => {
	let parent: FormGroup;
	let component: DimensionsSectionEditComponent;

	const configure = async (vehicleType: VehicleTypes) => {
		parent = new FormGroup({});
		await TestBed.configureTestingModule({
			imports: [DimensionsSectionEditComponent],
			providers: [
				provideMockStore({ initialState: initialAppState }),
				provideMockActions(() => of()),
				{ provide: ControlContainer, useValue: { control: parent } },
				{ provide: TechnicalRecordService, useValue: { getVehicleTypeWithSmallTrl: vi.fn() } },
			],
		})
			.overrideComponent(DimensionsSectionEditComponent, { set: { template: '' } })
			.compileComponents();
		const fixture = TestBed.createComponent(DimensionsSectionEditComponent);
		fixture.componentRef.setInput('techRecord', { techRecord_vehicleType: vehicleType });
		fixture.detectChanges();
		component = fixture.componentInstance;
	};

	it('attaches HGV dimension controls and displays warnings above the expected limits', async () => {
		await configure(VehicleTypes.HGV);

		expect(Object.keys(parent.controls)).toEqual(
			expect.arrayContaining([
				'techRecord_dimensions_length',
				'techRecord_dimensions_width',
				'techRecord_frontAxleTo5thWheelMin',
			])
		);
		expect(component.lengthWarning).toBe('');
		component.form.controls['techRecord_dimensions_length'].setValue('12001');
		component.form.controls['techRecord_dimensions_width'].setValue('2601');
		expect(component.lengthWarning).toContain('greater than 12,000mm');
		expect(component.widthWarning).toContain('greater than 2,600mm');
	});

	it('selects height and length controls for PSV', async () => {
		await configure(VehicleTypes.PSV);
		expect(component.form.contains('techRecord_dimensions_height')).toBe(true);
		expect(component.form.contains('techRecord_couplingCenterToRearTrlMin')).toBe(false);
	});

	it('selects trailer-specific controls and warns for coupling distances over the limit', async () => {
		await configure(VehicleTypes.TRL);
		expect(component.form.contains('techRecord_rearAxleToRearTrl')).toBe(true);
		expect(component.form.contains('techRecord_couplingCenterToRearTrlMin')).toBe(true);
		component.form.controls['techRecord_couplingCenterToRearTrlMin'].setValue('12001');
		component.form.controls['techRecord_couplingCenterToRearTrlMax'].setValue('12000');
		expect(component.couplingCenterToRearTrlMinWarning).toContain('greater than 12,000mm');
		expect(component.couplingCenterToRearTrlMaxWarning).toBe('');
	});

	it('exposes an axle spacing array when present and removes fields on destroy', async () => {
		await configure(VehicleTypes.HGV);
		expect(component.axleSpacings).toBeNull();
		const spacings = new FormArray<FormGroup>([]);
		parent.addControl('techRecord_dimensions_axleSpacing', spacings);
		expect(component.axleSpacings).toBe(spacings);

		component.ngOnDestroy();

		expect(Object.keys(parent.controls)).toEqual(['techRecord_dimensions_axleSpacing']);
	});
});
