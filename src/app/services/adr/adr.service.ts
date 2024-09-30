import { Injectable } from '@angular/core';
import { ADRDangerousGood } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/adrDangerousGood.enum.js';
import { ADRTankDetailsTankStatementSelect } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/adrTankDetailsTankStatementSelect.enum.js';
import { ADRTankStatementSubstancePermitted } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/adrTankStatementSubstancePermitted.js';
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
		return (
			techRecord.techRecord_adrDetails_dangerousGoods ||
			(techRecord.techRecord_adrDetails_dangerousGoods !== false &&
				Boolean(
					Object.keys(techRecord).find(
						(key) =>
							key !== 'techRecord_adrDetails_dangerousGoods' &&
							key.includes('adrDetails') &&
							techRecord[key as keyof TechRecordType<'hgv' | 'lgv' | 'trl'>] != null
					)
				))
		);
	}

	containsExplosives(arr: string[]) {
		return arr.includes(ADRDangerousGood.EXPLOSIVES_TYPE_2) || arr.includes(ADRDangerousGood.EXPLOSIVES_TYPE_3);
	}

	containsTankOrBattery(bodyType: string) {
		return bodyType.toLowerCase().includes('tank') || bodyType.toLowerCase().includes('battery');
	}

	canDisplayDangerousGoodsSection(techRecord: TechRecordType<'hgv' | 'lgv' | 'trl'>) {
		const dangerousGoods = techRecord.techRecord_adrDetails_dangerousGoods;
		return dangerousGoods === true;
	}

	canDisplayCompatibilityGroupJSection(techRecord: TechRecordType<'hgv' | 'lgv' | 'trl'>) {
		const permittedDangerousGoods = techRecord.techRecord_adrDetails_permittedDangerousGoods;
		const containsExplosives =
			Array.isArray(permittedDangerousGoods) && this.containsExplosives(permittedDangerousGoods);
		return this.canDisplayDangerousGoodsSection(techRecord) && containsExplosives;
	}

	canDisplayBatterySection(techRecord: TechRecordType<'hgv' | 'lgv' | 'trl'>) {
		const adrBodyType = techRecord.techRecord_adrDetails_vehicleDetails_type;
		return typeof adrBodyType === 'string' && adrBodyType.toLowerCase().includes('battery');
	}

	canDisplayTankOrBatterySection(techRecord: TechRecordType<'hgv' | 'lgv' | 'trl'>) {
		const adrBodyType = techRecord.techRecord_adrDetails_vehicleDetails_type;
		const containsTankOrBattery = typeof adrBodyType === 'string' && this.containsTankOrBattery(adrBodyType);
		return this.canDisplayDangerousGoodsSection(techRecord) && containsTankOrBattery;
	}

	canDisplayTankStatementSelectSection(techRecord: TechRecordType<'hgv' | 'lgv' | 'trl'>) {
		const tankStatementSubstancesPermitted =
			techRecord.techRecord_adrDetails_tank_tankDetails_tankStatement_substancesPermitted;
		const underUNNumber = tankStatementSubstancesPermitted === ADRTankStatementSubstancePermitted.UNDER_UN_NUMBER;
		return this.canDisplayTankOrBatterySection(techRecord) && underUNNumber;
	}

	canDisplayTankStatementStatementSection(techRecord: TechRecordType<'hgv' | 'lgv' | 'trl'>) {
		const tankStatementSelect = techRecord.techRecord_adrDetails_tank_tankDetails_tankStatement_select;
		const underStatement = tankStatementSelect === ADRTankDetailsTankStatementSelect.STATEMENT;
		return this.canDisplayTankStatementSelectSection(techRecord) && underStatement;
	}

	canDisplayTankStatementProductListSection(techRecord: TechRecordType<'hgv' | 'lgv' | 'trl'>) {
		const tankStatementSelect = techRecord.techRecord_adrDetails_tank_tankDetails_tankStatement_select;
		const underProductList = tankStatementSelect === ADRTankDetailsTankStatementSelect.PRODUCT_LIST;
		return this.canDisplayTankStatementSelectSection(techRecord) && underProductList;
	}

	canDisplayWeightSection(techRecord: TechRecordType<'hgv' | 'lgv' | 'trl'>) {
		const brakeEndurance = techRecord.techRecord_adrDetails_brakeEndurance;
		return this.canDisplayDangerousGoodsSection(techRecord) && brakeEndurance === true;
	}

	canDisplayBatteryListNumberSection(techRecord: TechRecordType<'hgv' | 'lgv' | 'trl'>) {
		const batteryListApplicable = techRecord.techRecord_adrDetails_listStatementApplicable;
		return this.canDisplayBatterySection(techRecord) && batteryListApplicable === true;
	}

	canDisplayIssueSection(techRecord: TechRecordType<'hgv' | 'lgv' | 'trl'>) {
		const brakeDeclarationsSeen = techRecord.techRecord_adrDetails_brakeDeclarationsSeen;
		return this.canDisplayDangerousGoodsSection(techRecord) && brakeDeclarationsSeen === true;
	}
}
