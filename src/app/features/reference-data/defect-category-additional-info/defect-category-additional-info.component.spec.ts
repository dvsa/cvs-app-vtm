import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AccordionComponent } from '@components/accordion/accordion.component';
import { DefectCategoryReferenceDataSchema } from '@dvsa/cvs-type-definitions/types/v1/defect-category-reference-data';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { UserService } from '@services/user-service/user-service';
import { selectDefectCategoryFromRoute } from '@store/defects';
import { addSectionStateFromGlobalError } from '@store/technical-records';
import { Subject, of } from 'rxjs';
import { DefectCategoryAmendComponent } from '../defect-category-amend/defect-category-amend.component';
import { DefectCategoryCreateComponent } from '../defect-category-create/defect-category-create.component';
import {
	createAdditionalInfoForm,
	includeVehiclesWithAdditionalInfo,
	populateAdditionalInfo,
	serialiseAdditionalInfo,
} from './defect-category-additional-info.component';

describe('Defect category additional information', () => {
	it('serialises selected vehicles, nullable options and ranges independently', () => {
		const fb = new FormBuilder();
		const vehicleTypes = fb.nonNullable.control<string[]>([]);
		const form = createAdditionalInfoForm(fb, vehicleTypes);
		expect(serialiseAdditionalInfo(form, vehicleTypes.value)).toBeNull();
		vehicleTypes.setValue(['psv', 'trl']);
		form.controls.psv.patchValue({
			notes: true,
			vertical: ['upper', 'lower'],
			horizontal: [],
			lateral: ['centre'],
			longitudinal: ['front'],
			rowNumber: 3,
			seatNumber: 1,
			axleNumber: 2,
		});
		expect(serialiseAdditionalInfo(form, vehicleTypes.value)).toEqual({
			psv: {
				notes: true,
				location: {
					vertical: ['upper', 'lower'],
					horizontal: null,
					lateral: ['centre'],
					longitudinal: ['front'],
					rowNumber: [1, 2, 3],
					seatNumber: [1],
					axleNumber: [1, 2],
				},
			},
			trl: { notes: false, location: null },
		});
		vehicleTypes.setValue([]);
		expect(serialiseAdditionalInfo(form, vehicleTypes.value)).toBeNull();
	});

	it('loads null, missing, empty and populated vehicle information', () => {
		const fb = new FormBuilder();
		const vehicleTypes = fb.nonNullable.control<string[]>(['psv', 'trl']);
		const form = createAdditionalInfoForm(fb, vehicleTypes);
		populateAdditionalInfo(form, {
			psv: {
				notes: true,
				location: { vertical: ['upper'], rowNumber: [1, 2, 3], seatNumber: null, axleNumber: [1, 2] },
			},
			trl: {},
		});
		expect(vehicleTypes.value).toEqual(['psv', 'trl']);
		expect(form.controls.psv.controls.rowNumber.value).toBe(3);
		expect(form.controls.psv.controls.seatNumber.value).toBeNull();
		expect(form.controls.psv.controls.axleNumber.value).toBe(2);
		expect(form.controls.trl.controls.notes.value).toBe(false);
		expect(form.controls.hgv.disabled).toBe(true);
		populateAdditionalInfo(form, null);
		vehicleTypes.setValue([]);
		expect(serialiseAdditionalInfo(form, vehicleTypes.value)).toBeNull();
		expect(form.controls.psv.controls.rowNumber.value).toBeNull();
	});

	it.each([
		['rowNumber', 20],
		['seatNumber', 6],
		['axleNumber', 10],
	] as const)('validates %s maxima and ignores unselected vehicle values', (field, maximum) => {
		const fb = new FormBuilder();
		const vehicleTypes = fb.nonNullable.control<string[]>(['hgv']);
		const form = createAdditionalInfoForm(fb, vehicleTypes);
		const control = form.controls.hgv.controls[field];
		for (const invalid of [0, -1, 1.5, maximum + 1]) {
			control.setValue(invalid);
			expect(control.invalid).toBe(true);
			expect(form.invalid).toBe(true);
			expect(() => serialiseAdditionalInfo(form, vehicleTypes.value)).toThrow(
				'Cannot serialise invalid additional information'
			);
		}
		control.setValue(maximum);
		expect(control.valid).toBe(true);
		control.setValue(null);
		expect(control.valid).toBe(true);
		control.setValue(maximum + 1);
		vehicleTypes.setValue([]);
		expect(form.invalid).toBe(false);
		expect(serialiseAdditionalInfo(form, vehicleTypes.value)).toBeNull();
	});

	it('includes unselected vehicles with existing settings without selecting empty vehicle objects', () => {
		expect(
			includeVehiclesWithAdditionalInfo(['hgv'], {
				psv: { notes: false },
				hgv: {},
				trl: {},
			})
		).toEqual(['hgv', 'psv']);
		expect(includeVehiclesWithAdditionalInfo([], { trl: { location: { lateral: ['offside'] } } })).toEqual(['trl']);
		expect(includeVehiclesWithAdditionalInfo(['hgv'], null)).toEqual(['hgv']);
	});
});

describe.each(['create', 'amend'] as const)('Category %s additional information UI', (mode) => {
	let fixture: ComponentFixture<DefectCategoryCreateComponent | DefectCategoryAmendComponent>;
	let actions: Subject<Action>;
	const category: DefectCategoryReferenceDataSchema = {
		imNumber: 1,
		imDescription: 'Brakes',
		forVehicleType: ['hgv'],
		additionalInfo: {
			psv: {},
			hgv: { notes: true, location: { lateral: ['offside'], rowNumber: [1, 2, 3] } },
			trl: {},
		},
		items: [],
	};

	beforeEach(() => {
		actions = new Subject<Action>();
		const component = mode === 'create' ? DefectCategoryCreateComponent : DefectCategoryAmendComponent;
		TestBed.configureTestingModule({
			imports: [component],
			providers: [
				provideRouter([]),
				provideMockStore({ selectors: [{ selector: selectDefectCategoryFromRoute, value: category }] }),
				provideMockActions(() => actions),
				{ provide: UserService, useValue: { roles$: of(['CVSFullAccess']) } },
			],
		});
		fixture = TestBed.createComponent(component);
		fixture.detectChanges();
	});

	it('allows each selected vehicle to have independent options and prepares the payload', () => {
		const page: HTMLElement = fixture.nativeElement;
		if (mode === 'amend') {
			const offside = page.querySelector<HTMLInputElement>('#hgv-lateral-offside-checkbox');
			expect(offside?.checked).toBe(true);
			expect(page.querySelector<HTMLInputElement>('input#hgv-rowNumber')?.value).toBe('3');
		} else {
			expect(page.querySelector('#hgv-lateral-offside-checkbox')).toBeNull();
			page.querySelector<HTMLInputElement>('#forVehicleType-hgv-checkbox')?.click();
			fixture.detectChanges();
		}
		const accordion = page.querySelector<HTMLButtonElement>('#accordion-control-additional-info-hgv');
		expect(accordion?.getAttribute('aria-expanded')).toBe('false');
		accordion?.click();
		fixture.detectChanges();
		expect(accordion?.getAttribute('aria-expanded')).toBe('true');
		page.querySelector<HTMLInputElement>('#hgv-vertical-upper-checkbox')?.click();
		const rowNumber = page.querySelector<HTMLInputElement>('input#hgv-rowNumber');
		expect(rowNumber).not.toBeNull();
		if (!rowNumber) throw new Error('Row number input not found');
		rowNumber.value = '2';
		rowNumber.dispatchEvent(new Event('input'));
		if (mode === 'create') page.querySelector<HTMLLabelElement>('label[for="hgv-notes-checkbox"]')?.click();
		fixture.detectChanges();
		const result = fixture.componentInstance.getFormValue().additionalInfo;
		expect(result?.hgv?.notes).toBe(true);
		expect(result?.hgv?.location?.vertical).toEqual(['upper']);
		expect(result?.hgv?.location?.rowNumber).toEqual([1, 2]);
		expect(page.querySelector<HTMLInputElement>('#hgv-vertical-upper-checkbox')?.checked).toBe(true);
		rowNumber.value = '';
		rowNumber.dispatchEvent(new Event('input'));
		fixture.detectChanges();
		expect(fixture.componentInstance.getFormValue().additionalInfo?.hgv?.location?.rowNumber).toBeNull();
	});

	it('blocks submission and displays the vehicle-specific range error', () => {
		const form = fixture.componentInstance.form;
		form.patchValue({ imNumber: 1, imDescription: 'Brakes', imDescriptionWelsh: 'Breciau' });
		form.controls.forVehicleType.setValue(['hgv']);
		form.controls.additionalInfo.controls.hgv.controls.seatNumber.setValue(7);
		fixture.detectChanges();
		const dispatch = vi.spyOn(TestBed.inject(MockStore), 'dispatch');
		fixture.componentInstance.handleSubmit();
		fixture.detectChanges();
		expect(form.invalid).toBe(true);
		expect(fixture.nativeElement.textContent).toContain(
			'HGV maximum seat number must be a whole number between 1 and 6'
		);
		expect(dispatch).toHaveBeenCalled();
		expect(() => fixture.componentInstance.getFormValue()).toThrow('Cannot serialise invalid additional information');
		const accordion = fixture.nativeElement.querySelector('#accordion-control-additional-info-hgv');
		expect(accordion.getAttribute('aria-expanded')).toBe('false');
		actions.next(addSectionStateFromGlobalError({ section: 'additional-info-hgv' }));
		fixture.detectChanges();
		expect(accordion.getAttribute('aria-expanded')).toBe('true');
	});

	it('uses a single selection, showing only selected collapsed sections and excluding deselected vehicles', () => {
		const page: HTMLElement = fixture.nativeElement;
		expect(page.querySelectorAll('govuk-checkbox-group#forVehicleType')).toHaveLength(1);
		const selected = fixture.componentInstance.form.controls.forVehicleType;
		selected.setValue(['psv', 'trl']);
		fixture.detectChanges();
		expect(page.querySelector('#accordion-control-additional-info-hgv')).toBeNull();
		expect(page.querySelector('#accordion-control-additional-info-psv')?.getAttribute('aria-expanded')).toBe('false');
		expect(page.querySelector('#accordion-control-additional-info-trl')?.getAttribute('aria-expanded')).toBe('false');
		const result = fixture.componentInstance.getFormValue();
		expect(result.forVehicleType).toEqual(['psv', 'trl']);
		expect(Object.keys(result.additionalInfo ?? {})).toEqual(['psv', 'trl']);
		selected.setValue([]);
		fixture.detectChanges();
		expect(page.querySelectorAll('app-accordion')).toHaveLength(0);
		expect(page.querySelector('app-accordion-control')?.parentElement?.hidden).toBe(true);
		expect(fixture.componentInstance.getFormValue().additionalInfo).toBeNull();
	});

	it('preserves vehicle settings while deselected and restores them on reselection', () => {
		const form = fixture.componentInstance.form;
		form.controls.forVehicleType.setValue(['hgv']);
		form.controls.additionalInfo.controls.hgv.controls.rowNumber.setValue(4);
		form.controls.forVehicleType.setValue([]);
		fixture.detectChanges();
		expect(fixture.componentInstance.getFormValue().additionalInfo).toBeNull();
		form.controls.forVehicleType.setValue(['hgv']);
		fixture.detectChanges();
		expect(fixture.componentInstance.getFormValue().additionalInfo?.hgv?.location?.rowNumber).toEqual([1, 2, 3, 4]);
		expect(
			fixture.nativeElement.querySelector('#accordion-control-additional-info-hgv').getAttribute('aria-expanded')
		).toBe('false');
	});

	it('stops handling error navigation after leaving the form', () => {
		fixture.componentInstance.form.controls.forVehicleType.setValue(['hgv']);
		fixture.detectChanges();
		const accordion = fixture.debugElement.query(By.directive(AccordionComponent)).componentInstance;
		const open = vi.spyOn(accordion, 'open');
		fixture.destroy();
		actions.next(addSectionStateFromGlobalError({ section: 'additional-info-hgv' }));
		expect(open).not.toHaveBeenCalled();
	});
});

it('selects and preserves previously unselected vehicles with configured additional information on amend', () => {
	TestBed.configureTestingModule({
		imports: [DefectCategoryAmendComponent],
		providers: [
			provideRouter([]),
			provideMockStore({
				selectors: [
					{
						selector: selectDefectCategoryFromRoute,
						value: {
							imNumber: 1,
							imDescription: 'Brakes',
							forVehicleType: ['hgv'],
							additionalInfo: { psv: { notes: false, location: { vertical: ['upper'] } }, hgv: {}, trl: {} },
							items: [],
						},
					},
				],
			}),
			provideMockActions(() => of()),
			{ provide: UserService, useValue: { roles$: of(['CVSFullAccess']) } },
		],
	});
	const fixture = TestBed.createComponent(DefectCategoryAmendComponent);
	fixture.detectChanges();
	expect(fixture.componentInstance.form.controls.forVehicleType.value).toEqual(['hgv', 'psv']);
	expect(fixture.nativeElement.querySelector('#forVehicleType-psv-checkbox').checked).toBe(true);
	expect(fixture.componentInstance.getFormValue().additionalInfo?.psv?.location?.vertical).toEqual(['upper']);
	expect(fixture.nativeElement.querySelector('#accordion-control-additional-info-trl')).toBeNull();
});
