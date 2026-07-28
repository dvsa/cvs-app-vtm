import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class TestTypeService {
	isTestTypeFirstTest(testTypeId: string): boolean {
		const firstTestIds = ['41', '95', '65', '66', '67', '103', '104', '82', '83', '119', '120'];
		return firstTestIds.includes(testTypeId);
	}

	isTestTypeNotifiableAlteration(testTypeId: string): boolean {
		const notifiableAlterationIds = ['38', '47', '48'];
		return notifiableAlterationIds.includes(testTypeId);
	}

	isTestTypeCOIF(testTypeId: string): boolean {
		const coifIds = ['142', '143', '175', '176'];
		return coifIds.includes(testTypeId);
	}

	isTestTypeIVA(testTypeId: string): boolean {
		const ivaIds = [
			'133',
			'134',
			'138',
			'139',
			'140',
			'165',
			'169',
			'167',
			'170',
			'135',
			'172',
			'173',
			'439',
			'449',
			'136',
			'187',
			'126',
			'186',
			'193',
			'192',
			'195',
			'162',
			'191',
			'128',
			'188',
			'189',
			'125',
			'161',
			'158',
			'159',
			'154',
			'190',
			'129',
			'196',
			'194',
			'197',
			'185',
			'420',
			'438',
			'163',
			'153',
			'184',
			'130',
			'183',
		];
		return ivaIds.includes(testTypeId);
	}
}
