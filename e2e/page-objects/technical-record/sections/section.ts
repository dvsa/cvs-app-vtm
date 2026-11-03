import {
	Section as AccordionSection,
	type SectionFields,
	fillFields,
	mapRecordFields,
} from '../../../components/section.component';

export { SectionList, SectionRows, fillFields } from '../../../components/section.component';
export type { NullableSectionValues, SectionFields, SectionValues } from '../../../components/section.component';

export abstract class Section extends AccordionSection {
	abstract readonly fields: SectionFields<Record<string, never>>;

	async fillFromRecord(record: object, excluded: readonly string[] = []): Promise<void> {
		const values = mapRecordFields(this.fields, record, excluded);
		if (!Object.keys(values).length) return;
		await this.open();
		await fillFields(this.fields, values);
	}
}
