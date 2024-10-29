import { Injectable } from '@angular/core';
import { ADRTankDetailsTankStatementSelect } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/adrTankDetailsTankStatementSelect.enum.js';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';

@Injectable({
	providedIn: 'root',
})
export class AdrService {
	determineTankStatementSelect(techRecord: TechRecordType<'hgv' | 'lgv' | 'trl'>) {
		const {
			techRecord_adrDetails_tank_tankDetails_tankStatement_statement: statement,
			techRecord_adrDetails_tank_tankDetails_tankStatement_productList: productList,
			techRecord_adrDetails_tank_tankDetails_tankStatement_productListUnNo: productListUnNo,
			techRecord_adrDetails_tank_tankDetails_tankStatement_productListRefNo: productListRefNo,
		} = techRecord;

		if (statement) return ADRTankDetailsTankStatementSelect.STATEMENT;
		if (productList || productListRefNo || (productListUnNo && productListUnNo.length > 0))
			return ADRTankDetailsTankStatementSelect.PRODUCT_LIST;

		return null;
	}

	carriesDangerousGoods(techRecord: TechRecordType<'hgv' | 'lgv' | 'trl'>) {
		return techRecord.techRecord_adrDetails_dangerousGoods === true;
	}

	preprocessTechRecord(techRecord: TechRecordType<'hgv' | 'lgv' | 'trl'>) {
		if (!this.carriesDangerousGoods(techRecord)) {
			// Remove all ADR fields
			for (const key in techRecord) {
				if (key.startsWith('techRecord_adrDetails')) {
					delete techRecord[key as keyof TechRecordType<'hgv' | 'lgv' | 'trl'>];
				}
			}

			// but keep the dangerousGoods field
			techRecord.techRecord_adrDetails_dangerousGoods = false;
		}

		return techRecord;
	}
}
