import { CustomFormControl, CustomFormGroup, FormNodeTypes } from '@services/dynamic-forms/dynamic-form.types';
import { AdrValidators } from './adr.validators';

describe('ADR Validators', () => {
	let form: CustomFormGroup;

	beforeEach(() => {
		form = new CustomFormGroup(
			{ type: FormNodeTypes.GROUP, name: 'adrForm' },
			{
				techRecord_adrDetails_tank_tankDetails_tankStatement_productListUnNo: new CustomFormControl({
					name: 'techRecord_adrDetails_tank_tankDetails_tankStatement_productListUnNo',
					type: FormNodeTypes.CONTROL,
				}),
				techRecord_adrDetails_tank_tankDetails_tankStatement_productListRefNo: new CustomFormControl({
					name: 'techRecord_adrDetails_tank_tankDetails_tankStatement_productListRefNo',
					type: FormNodeTypes.CONTROL,
				}),
			}
		);
	});

	describe('validateProductListRefNo', () => {
		it('should return NULL if the control is hidden', () => {
			const control = form.get(
				'techRecord_adrDetails_tank_tankDetails_tankStatement_productListRefNo'
			) as CustomFormControl;
			control.meta.hide = true;

			expect(AdrValidators.validateProductListRefNo(control)).toBeNull();
		});

		it('should return an error message if the product list reference number and first UN number is empty', () => {
			const a = form.get('techRecord_adrDetails_tank_tankDetails_tankStatement_productListRefNo') as CustomFormControl;
			a.meta.hide = false;
			a.patchValue(''); // make so product list reference number is empty

			const b = form.get('techRecord_adrDetails_tank_tankDetails_tankStatement_productListUnNo') as CustomFormControl;
			b.meta.hide = false;
			b.patchValue(['']); // make so first UN number is empty

			expect(AdrValidators.validateProductListRefNo(a)).toStrictEqual({
				custom: {
					message: 'Reference number or UN number 1 is required when selecting Product List',
				},
			});
		});

		it('should return NULL if the product list reference number is populated', () => {
			const a = form.get('techRecord_adrDetails_tank_tankDetails_tankStatement_productListRefNo') as CustomFormControl;
			a.meta.hide = false;
			a.patchValue('reference no.'); // make so product list reference number is populated

			const b = form.get('techRecord_adrDetails_tank_tankDetails_tankStatement_productListUnNo') as CustomFormControl;
			b.meta.hide = false;
			b.patchValue(['']); // make so first UN number is empty

			expect(AdrValidators.validateProductListRefNo(a)).toBeNull();
		});

		it('should return NULL if the first UN number is populated', () => {
			const a = form.get('techRecord_adrDetails_tank_tankDetails_tankStatement_productListRefNo') as CustomFormControl;
			a.meta.hide = false;
			a.patchValue(''); // make so product list reference number is empty

			const b = form.get('techRecord_adrDetails_tank_tankDetails_tankStatement_productListUnNo') as CustomFormControl;
			b.meta.hide = false;
			b.patchValue(['something']); // make so first UN number is empty

			expect(AdrValidators.validateProductListRefNo(a)).toBeNull();
		});
	});

	describe('validProductListUNNumbers', () => {
		it('should return NULL if the control is hidden', () => {
			const control = form.get(
				'techRecord_adrDetails_tank_tankDetails_tankStatement_productListUnNo'
			) as CustomFormControl;
			control.meta.hide = true;

			expect(AdrValidators.validateProductListUNNumbers(control)).toBeNull();
		});

		it('should return an error message if the product list reference number and first UN number is empty', () => {
			const a = form.get('techRecord_adrDetails_tank_tankDetails_tankStatement_productListRefNo') as CustomFormControl;
			a.meta.hide = false;
			a.patchValue(''); // make so product list reference number is empty

			const b = form.get('techRecord_adrDetails_tank_tankDetails_tankStatement_productListUnNo') as CustomFormControl;
			b.meta.hide = false;
			b.patchValue(['']); // make so first UN number is empty

			expect(AdrValidators.validateProductListUNNumbers(b)).toStrictEqual({
				custom: {
					anchorLink: 'UN_number_1',
					message: 'Reference number or UN number 1 is required when selecting Product List',
				},
			});
		});

		it('should return an error message if the last UN number is empty', () => {
			const a = form.get('techRecord_adrDetails_tank_tankDetails_tankStatement_productListRefNo') as CustomFormControl;
			a.meta.hide = false;
			a.patchValue(''); // make so product list reference number is empty

			const b = form.get('techRecord_adrDetails_tank_tankDetails_tankStatement_productListUnNo') as CustomFormControl;
			b.meta.hide = false;
			b.patchValue(['first un', '']); // make so last UN number is empty

			expect(AdrValidators.validateProductListUNNumbers(b)).toStrictEqual({
				custom: {
					anchorLink: 'UN_number_2',
					message: 'UN number 2 is required or remove UN number 2',
				},
			});
		});

		it('should return an error message for any UN number which exceeds 1500 characters', () => {
			const longString = new Array(1501).fill('a').join();

			const a = form.get('techRecord_adrDetails_tank_tankDetails_tankStatement_productListRefNo') as CustomFormControl;
			a.meta.hide = false;
			a.patchValue(''); // make so product list reference number is empty

			const b = form.get('techRecord_adrDetails_tank_tankDetails_tankStatement_productListUnNo') as CustomFormControl;
			b.meta.hide = false;
			b.patchValue(['first un', longString, longString, longString]); // make so last UN number is empty

			expect(AdrValidators.validateProductListUNNumbers(b)).toStrictEqual({
				multiple: [
					{
						anchorLink: 'UN_number_2',
						error: 'UN number 2 must be less than or equal to 1500 characters',
					},
					{
						anchorLink: 'UN_number_3',
						error: 'UN number 3 must be less than or equal to 1500 characters',
					},
					{
						anchorLink: 'UN_number_4',
						error: 'UN number 4 must be less than or equal to 1500 characters',
					},
				],
			});
		});

		it('should return NULL if ALL UN numbers are populated, but less than 1500 characters in length', () => {
			const a = form.get('techRecord_adrDetails_tank_tankDetails_tankStatement_productListRefNo') as CustomFormControl;
			a.meta.hide = false;
			a.patchValue(''); // make so product list reference number is empty

			const b = form.get('techRecord_adrDetails_tank_tankDetails_tankStatement_productListUnNo') as CustomFormControl;
			b.meta.hide = false;
			b.patchValue(['small string', 'small string', 'small string']); // make so last UN number is empty

			expect(AdrValidators.validateProductListUNNumbers(b)).toBeNull();
		});
	});
});
