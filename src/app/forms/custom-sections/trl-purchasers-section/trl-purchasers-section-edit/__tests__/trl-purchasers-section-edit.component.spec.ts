import { TestBed } from '@angular/core/testing';
import { ControlContainer, FormControl, FormGroup } from '@angular/forms';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { provideMockStore } from '@ngrx/store/testing';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { initialAppState } from '@store/index';
import { TRLPurchasersSectionEditComponent } from '../trl-purchasers-section-edit.component';

describe('TRLPurchasersSectionEditComponent', () => {
	let parent: FormGroup;
	let component: TRLPurchasersSectionEditComponent;

	const configure = async (vehicleType: VehicleTypes) => {
		parent = new FormGroup({});
		await TestBed.configureTestingModule({
			imports: [TRLPurchasersSectionEditComponent],
			providers: [
				provideMockStore({ initialState: initialAppState }),
				{ provide: ControlContainer, useValue: { control: parent } },
				{
					provide: TechnicalRecordService,
					useValue: {
						getVehicleTypeWithSmallTrl: (record: { techRecord_vehicleType: VehicleTypes }) =>
							record.techRecord_vehicleType,
					},
				},
			],
		})
			.overrideComponent(TRLPurchasersSectionEditComponent, { set: { template: '' } })
			.compileComponents();
		const fixture = TestBed.createComponent(TRLPurchasersSectionEditComponent);
		fixture.componentRef.setInput('techRecord', { techRecord_vehicleType: vehicleType });
		fixture.detectChanges();
		component = fixture.componentInstance;
	};

	it('attaches purchaser fields only for trailer records', async () => {
		await configure(VehicleTypes.TRL);

		expect(Object.keys(parent.controls)).toHaveLength(10);
		expect(component.vehicleType).toBe(VehicleTypes.TRL);
		expect(component.shouldDisplayFormControl('techRecord_purchaserDetails_name')).toBe(true);
		expect(component.shouldDisplayFormControl('unknown')).toBe(false);
	});

	it('validates purchaser email format and maximum lengths', async () => {
		await configure(VehicleTypes.TRL);
		const email = component.form.get('techRecord_purchaserDetails_emailAddress') as unknown as FormControl<
			string | null
		>;
		email.setValue('not-an-email');
		expect(email.errors).toHaveProperty('pattern');
		email.setValue('buyer@example.gov.uk');
		expect(email.errors).toBeNull();

		const postcode = component.form.get('techRecord_purchaserDetails_postCode') as unknown as FormControl<
			string | null
		>;
		postcode.setValue('A'.repeat(13));
		expect(postcode.errors).toHaveProperty('maxLength');
	});

	it('does not attach purchaser fields for non-trailer records', async () => {
		await configure(VehicleTypes.HGV);
		expect(Object.keys(parent.controls)).toEqual([]);
	});

	it('detaches all trailer purchaser fields on destroy', async () => {
		await configure(VehicleTypes.TRL);
		component.ngOnDestroy();

		expect(Object.keys(parent.controls)).toEqual([]);
	});
});
