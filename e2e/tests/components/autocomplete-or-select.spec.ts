import { expect, test } from '@playwright/test';
import { AutocompleteOrSelect } from '../../components/autocomplete-or-select.component';

test('body make selects a trailer autocomplete option', async ({ page }) => {
	await page.setContent(`
		<div>
			<input id="techRecord_make" />
			<button role="option" onclick="this.parentElement.querySelector('input').value = 'ABELL'; this.remove()">
				ABELL
			</button>
		</div>
	`);
	const make = new AutocompleteOrSelect(page, 'techRecord_make');

	await make.fill('ABELL');

	await expect(page.getByRole('option')).toHaveCount(0);
	await expect.poll(make.value).toBe('ABELL');
});

test('body make still selects an HGV option with an Angular-prefixed value', async ({ page }) => {
	await page.setContent(`
		<select id="techRecord_make">
			<option value="">Select body make</option>
			<option value="1: SCANIA">SCANIA</option>
		</select>
	`);
	const make = new AutocompleteOrSelect(page, 'techRecord_make');

	await make.fill('SCANIA');

	await expect(page.locator('#techRecord_make')).toHaveValue('1: SCANIA');
	await expect.poll(make.value).toBe('SCANIA');
});
