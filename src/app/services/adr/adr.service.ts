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
    if (productList || productListRefNo || (productListUnNo && productListUnNo.length > 0)) return ADRTankDetailsTankStatementSelect.PRODUCT_LIST;

    return null;
  }

  carriesDangerousGoods(techRecord: TechRecordType<'hgv' | 'lgv' | 'trl'>) {
    return techRecord.techRecord_adrDetails_dangerousGoods
    || (techRecord.techRecord_adrDetails_dangerousGoods !== false && Boolean(Object.keys(techRecord).find((key) =>
      key !== 'techRecord_adrDetails_dangerousGoods'
      && key.includes('adrDetails')
      && techRecord[key as keyof TechRecordType<'hgv' | 'lgv' | 'trl'>] != null)));
  }
}
