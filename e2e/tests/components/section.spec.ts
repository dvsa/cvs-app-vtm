import { expect, test } from '@playwright/test';
import { SectionList, SectionRows, fillFields, mapRecordFields } from '../../components/section.component';

test('section filling skips null and undefined but preserves false, zero and empty strings', async () => {
	const entered: unknown[] = [];
	const fields = {
		missing: {
			fill: async (value: string) => {
				entered.push(value);
			},
		},
		unset: {
			fill: async (value: string) => {
				entered.push(value);
			},
		},
		marker: {
			fill: async (value: boolean) => {
				entered.push(value);
			},
		},
		count: {
			fill: async (value: number) => {
				entered.push(value);
			},
		},
		notes: {
			fill: async (value: string) => {
				entered.push(value);
			},
		},
	};
	await fillFields(fields, { missing: null, unset: undefined, marker: false, count: 0, notes: '' });
	expect(entered).toEqual([false, 0, '']);
});

test('record mapping copies only supplied section fields and honors exclusions', () => {
	const fields = {
		make: { fill: async (_value: string) => {} },
		count: { fill: async (_value: number) => {} },
		marker: { fill: async (_value: boolean) => {} },
		notes: { fill: async (_value: string) => {} },
	};
	expect(
		mapRecordFields(fields, { make: 'TEST', count: 0, marker: false, notes: null, unrelated: 'ignored' }, ['make'])
	).toEqual({ count: 0, marker: false });
});

test('record mapping projects axle rows onto their section and preserves row positions', async () => {
	const entered: [number, number][] = [];
	const rows = new SectionRows((index) => ({
		weight: {
			fill: async (value: number) => {
				entered.push([index, value]);
			},
		},
	}));
	const fields = { axles: rows };
	const values = mapRecordFields(fields, { axles: [{ weight: null, tyre: 'ignored' }, { weight: 0 }] });
	await fillFields(fields, values);
	expect(entered).toEqual([[1, 0]]);
});

test('section lists skip null and undefined without shifting later field indexes', async () => {
	const entered: [number, string][] = [];
	const list = new SectionList((index) => ({
		fill: async (value: string) => {
			entered.push([index, value]);
		},
	}));
	await list.fill([null, undefined, 'value']);
	expect(entered).toEqual([[2, 'value']]);
});

test('record mapping omits row groups with no supplied editable fields', () => {
	const fields = {
		axles: new SectionRows(() => ({ weight: { fill: async (_value: number) => {} } })),
	};
	expect(mapRecordFields(fields, { axles: [{ axleNumber: 1 }, { weight: null }] })).toEqual({});
});
