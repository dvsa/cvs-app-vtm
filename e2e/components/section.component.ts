import { Locator, Page } from '@playwright/test';
import { Accordion } from './accordion.component';

export type SectionFields<Values> = {
	[Key in keyof Values]: { fill(value: Values[Key]): Promise<void> };
};

export type SectionValues<Fields> = {
	[Key in keyof Fields]: Fields[Key] extends { fill(value: infer Value): Promise<void> } ? Value : never;
};

export async function fillFields<Values>(fields: SectionFields<Values>, values: Partial<Values>): Promise<void> {
	for (const key in values) {
		if (!Object.hasOwn(fields, key)) throw new Error(`Unknown section field "${key}".`);
		const value = values[key];
		if (value !== undefined) await fields[key].fill(value);
	}
}

export class Section extends Accordion {
	readonly content: Locator;

	constructor(scope: Page | Locator, id: string) {
		super(scope, `accordion-control-${id}`);
		this.content = scope.locator(`[id=${JSON.stringify(`accordion-details-${id}`)}]`);
	}
}

export class SectionRows<Values> {
	constructor(private readonly fieldsAt: (index: number) => SectionFields<Values>) {}

	async fill(values: Partial<Values>[]): Promise<void> {
		for (const [index, row] of values.entries()) {
			await fillFields(this.fieldsAt(index), row);
		}
	}
}

export class SectionList<Value> {
	constructor(private readonly fieldAt: (index: number) => { fill(value: Value): Promise<void> }) {}

	async fill(values: Value[]): Promise<void> {
		for (const [index, value] of values.entries()) {
			await this.fieldAt(index).fill(value);
		}
	}
}
