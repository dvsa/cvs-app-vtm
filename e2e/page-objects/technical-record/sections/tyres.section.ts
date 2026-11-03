import { Locator, Page } from '@playwright/test';
import { Input } from '../../../components/input.component';
import { Select } from '../../../components/select.component';
import { Section, SectionRows, SectionValues, fillFields } from './section';

export class TyresSection extends Section {
	constructor(scope: Page | Locator) {
		super(scope, 'tyres');
	}

	readonly fields = {
		techRecord_axles: new SectionRows((index) => ({
			tyres_tyreCode: new Input(this.content, `tyres_tyreCode-${index + 1}`),
			tyres_tyreSize: new Input(this.content, `tyres_tyreSize-${index + 1}`),
			tyres_plyRating: new Input(this.content, `tyres_plyRating-${index + 1}`),
			tyres_dataTrAxles: new Input(this.content, `tyres_dataTrAxles-${index + 1}`),
			tyres_speedCategorySymbol: new Select(this.content, `tyres_speedCategorySymbol-${index + 1}`),
			tyres_fitmentCode: new Select(this.content, `tyres_fitmentCode-${index + 1}`),
		})),
		techRecord_tyreUseCode: new Select(this.content, 'techRecord_tyreUseCode'),
	};

	async fill(values: Partial<SectionValues<typeof this.fields>>): Promise<void> {
		await this.open();
		await fillFields(this.fields, values);
	}

	async fillTyreCodes(codes: (number | null | undefined)[]): Promise<void> {
		if (!codes.some((code) => code != null)) return;
		await this.open();
		for (const [index, code] of codes.entries()) {
			if (code == null) continue;
			const field = new Input(this.content, `tyres_tyreCode-${index + 1}`);
			await field.fill(code);
			await field.locator.blur();
		}
	}
}
