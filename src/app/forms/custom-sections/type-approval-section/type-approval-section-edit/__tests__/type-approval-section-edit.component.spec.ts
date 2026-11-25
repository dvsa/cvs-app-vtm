import { TestBed } from '@angular/core/testing';
import { ControlContainer, FormControl, FormGroup } from '@angular/forms';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { provideMockStore } from '@ngrx/store/testing';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { initialAppState } from '@store/index';
import { TypeApprovalSectionEditComponent } from '../type-approval-section-edit.component';

describe('TypeApprovalSectionEditComponent', () => {
	let parent: FormGroup;
	let component: TypeApprovalSectionEditComponent;

	const configure = async (vehicleType: VehicleTypes) => {
		parent = new FormGroup({});
		await TestBed.configureTestingModule({
			imports: [TypeApprovalSectionEditComponent],
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
			.overrideComponent(TypeApprovalSectionEditComponent, { set: { template: '' } })
			.compileComponents();
		const fixture = TestBed.createComponent(TypeApprovalSectionEditComponent);
		fixture.componentRef.setInput('techRecord', { techRecord_vehicleType: vehicleType });
		fixture.detectChanges();
		component = fixture.componentInstance;
	};

	it('attaches common controls and PSV-only COIF controls to the parent form', async () => {
		await configure(VehicleTypes.PSV);

		expect(Object.keys(parent.controls)).toEqual(
			expect.arrayContaining([
				'techRecord_approvalType',
				'techRecord_approvalTypeNumber',
				'techRecord_ntaNumber',
				'techRecord_coifSerialNumber',
				'techRecord_coifCertifierName',
				'techRecord_coifDate',
			])
		);
		expect(component.vehicleType).toBe(VehicleTypes.PSV);
		expect(component.shouldDisplayFormControl('techRecord_coifDate')).toBe(true);
		expect(component.shouldDisplayFormControl('missing')).toBe(false);
	});

	it('omits PSV-only controls for HGV and requires an approval number only when approval type is selected', async () => {
		await configure(VehicleTypes.HGV);

		expect(component.shouldDisplayFormControl('techRecord_coifDate')).toBe(false);
		const approvalType = component.form.get('techRecord_approvalType') as FormControl;
		const approvalNumber = component.form.get('techRecord_approvalTypeNumber') as FormControl;
		approvalType.setValue('type');
		expect(approvalNumber.validator?.(approvalNumber)).toEqual({
			required: 'Approval type number is required with Approval type',
		});
		approvalNumber.setValue('123');
		expect(approvalNumber.validator?.(approvalNumber)).toBeNull();
		expect(approvalType.validator?.(approvalType)).toHaveProperty('oneOf');
	});

	it('removes all attached fields and completes its destroy notifier', async () => {
		await configure(VehicleTypes.TRL);
		const complete = vi.spyOn(component.destroy$, 'complete');

		component.ngOnDestroy();

		expect(Object.keys(parent.controls)).toEqual([]);
		expect(complete).toHaveBeenCalledOnce();
	});
});
