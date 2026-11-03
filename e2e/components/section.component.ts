import { Locator, Page } from '@playwright/test';
import { Accordion } from './accordion.component';

export type SectionFields<Values> = {
	[Key in keyof Values]: { fill(value: Values[Key]): Promise<void> };
};

export type SectionValues<Fields> = {
	[Key in keyof Fields]: Fields[Key] extends { fill(value: infer Value): Promise<void> } ? Value | null : never;
};

export type NullableSectionValues<Values> = { [Key in keyof Values]?: Values[Key] | null };

export async function fillFields<Values>(
	fields: SectionFields<Values>,
	values: NullableSectionValues<Values>
): Promise<void> {
	for (const key in values) {
		if (!Object.hasOwn(fields, key)) throw new Error(`Unknown section field "${key}".`);
		const value = values[key];
		if (value != null) await fields[key].fill(value);
	}
}

export function mapRecordFields<Values>(
	fields: SectionFields<Values>,
	record: object,
	excluded: readonly string[] = []
): Partial<Values> {
	const values: Partial<Values> = {};
	for (const key in fields) {
		if (excluded.includes(key)) continue;
		const value: unknown = Reflect.get(record, key);
		if (value == null) continue;
		const field = fields[key];
		const mapped = field instanceof SectionRows && Array.isArray(value) ? field.mapRecordRows(value) : value;
		if (field instanceof SectionRows && Array.isArray(mapped) && !mapped.some((row) => Object.keys(row).length)) {
			continue;
		}
		// Only matching section keys are copied; record and control value types share the domain schema.
		values[key] = mapped as Values[typeof key];
	}
	return values;
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

	async fill(values: NullableSectionValues<Values>[]): Promise<void> {
		for (const [index, row] of values.entries()) {
			await fillFields(this.fieldsAt(index), row);
		}
	}

	mapRecordRows(values: unknown[]): Partial<Values>[] {
		return values.map((row, index) => {
			if (typeof row !== 'object' || row === null) throw new Error(`Invalid section row at index ${index}.`);
			return mapRecordFields(this.fieldsAt(index), row);
		});
	}
}

export class SectionList<Value> {
	constructor(private readonly fieldAt: (index: number) => { fill(value: Value): Promise<void> }) {}

	async fill(values: (Value | null | undefined)[]): Promise<void> {
		for (const [index, value] of values.entries()) {
			if (value == null) continue;
			await this.fieldAt(index).fill(value);
		}
	}
}
