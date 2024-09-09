import { TestBed } from '@angular/core/testing';

import { ADRTankDetailsTankStatementSelect } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/adrTankDetailsTankStatementSelect.enum.js';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { AdrService } from '../adr.service';

describe('AdrService', () => {
	let service: AdrService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(AdrService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	describe('carriesDangerousGoods', () => {
		it('should return true if vehicle carries dangerous goods', () => {
			expect(
				service.carriesDangerousGoods({ techRecord_adrDetails_batteryListNumber: 'number' } as TechRecordType<'hgv'>)
			).toBe(true);
		});
		it('should return false if vehicle does not carry dangerous goods', () => {
			expect(
				service.carriesDangerousGoods({
					techRecord_reasonForCreation: 'carries non-dangerous goods',
				} as TechRecordType<'hgv'>)
			).toBe(false);
		});
	});

	describe('determineTankStatementSelect', () => {
		it('should return STATEMENT if tankStatement_statement is truthy', () => {
			const techRecord = {
				techRecord_adrDetails_tank_tankDetails_tankStatement_statement: 'Reference no.',
			} as TechRecordType<'hgv'>;
			expect(service.determineTankStatementSelect(techRecord)).toBe(ADRTankDetailsTankStatementSelect.STATEMENT);
		});

		it('should return PRODUCT_LIST if tankStatement_productList is truthy', () => {
			const techRecord = {
				techRecord_adrDetails_tank_tankDetails_tankStatement_productList: 'Product list',
			} as TechRecordType<'hgv'>;
			expect(service.determineTankStatementSelect(techRecord)).toBe(ADRTankDetailsTankStatementSelect.PRODUCT_LIST);
		});

		it('should return PRODUCT_LIST if tankStatement_productListRefNo is truthy', () => {
			const techRecord = {
				techRecord_adrDetails_tank_tankDetails_tankStatement_productListRefNo: 'Reference no.',
			} as TechRecordType<'hgv'>;
			expect(service.determineTankStatementSelect(techRecord)).toBe(ADRTankDetailsTankStatementSelect.PRODUCT_LIST);
		});

		it('should return PRODUCT_LIST if tankStatement_productListUnNo is truthy AND has 1 index', () => {
			const techRecord = {
				techRecord_adrDetails_tank_tankDetails_tankStatement_productListUnNo: ['UN no.'],
			} as TechRecordType<'hgv'>;
			expect(service.determineTankStatementSelect(techRecord)).toBe(ADRTankDetailsTankStatementSelect.PRODUCT_LIST);
		});

		it('should return null if tankStatement_statement is falsy', () => {
			const a = {} as TechRecordType<'hgv'>;
			const b = { techRecord_adrDetails_tank_tankDetails_tankStatement_statement: null } as TechRecordType<'hgv'>;
			const c = { techRecord_adrDetails_tank_tankDetails_tankStatement_statement: undefined } as TechRecordType<'hgv'>;
			expect(service.determineTankStatementSelect(a)).toBeNull();
			expect(service.determineTankStatementSelect(b)).toBeNull();
			expect(service.determineTankStatementSelect(c)).toBeNull();
		});

		it('should return null if tankStatement_productList is falsy', () => {
			const a = {} as TechRecordType<'hgv'>;
			const b = { techRecord_adrDetails_tank_tankDetails_tankStatement_productList: null } as TechRecordType<'hgv'>;
			const c = {
				techRecord_adrDetails_tank_tankDetails_tankStatement_productList: undefined,
			} as TechRecordType<'hgv'>;
			expect(service.determineTankStatementSelect(a)).toBeNull();
			expect(service.determineTankStatementSelect(b)).toBeNull();
			expect(service.determineTankStatementSelect(c)).toBeNull();
		});

		it('should return null if tankStatement_productListRefNo is falsy', () => {
			const a = {} as TechRecordType<'hgv'>;
			const b = {
				techRecord_adrDetails_tank_tankDetails_tankStatement_productListRefNo: null,
			} as TechRecordType<'hgv'>;
			const c = {
				techRecord_adrDetails_tank_tankDetails_tankStatement_productListRefNo: undefined,
			} as TechRecordType<'hgv'>;
			expect(service.determineTankStatementSelect(a)).toBeNull();
			expect(service.determineTankStatementSelect(b)).toBeNull();
			expect(service.determineTankStatementSelect(c)).toBeNull();
		});

		it('should return null if tankStatement_productListUnNo is falsy AND has 1 index', () => {
			const techRecord = {
				techRecord_adrDetails_tank_tankDetails_tankStatement_productListUnNo: ['UN no.'],
			} as TechRecordType<'hgv'>;
			expect(service.determineTankStatementSelect(techRecord)).toBe(ADRTankDetailsTankStatementSelect.PRODUCT_LIST);

			const a = {} as TechRecordType<'hgv'>;
			const b = { techRecord_adrDetails_tank_tankDetails_tankStatement_productListUnNo: null } as TechRecordType<'hgv'>;
			const c = {
				techRecord_adrDetails_tank_tankDetails_tankStatement_productListUnNo: undefined,
			} as TechRecordType<'hgv'>;
			const d = {
				techRecord_adrDetails_tank_tankDetails_tankStatement_productListUnNo: [] as string[],
			} as TechRecordType<'hgv'>;
			expect(service.determineTankStatementSelect(a)).toBeNull();
			expect(service.determineTankStatementSelect(b)).toBeNull();
			expect(service.determineTankStatementSelect(c)).toBeNull();
			expect(service.determineTankStatementSelect(d)).toBeNull();
		});
	});
});
