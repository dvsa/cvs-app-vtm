import { HGVAxles } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/hgv/complete';
import { PSVAxlesComplete } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/psv/complete';
import { TRLAxles } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/trl/complete';

export function createHGVAxle(axleNumber = 1): HGVAxles {
	return {
		axleNumber,
		weights_gbWeight: 10000,
		weights_designWeight: 11500,
		tyres_tyreCode: 428,
		tyres_tyreSize: '315/80-22.5',
		tyres_fitmentCode: 'double',
	};
}

export function createHGVAxles(noAxles: number): HGVAxles[] {
	return Array.from({ length: noAxles }, (_, index) => createHGVAxle(index + 1));
}

export function createPSVAxle(axleNumber = 1): PSVAxlesComplete {
	return {
		axleNumber,
		parkingBrakeMrk: false,
		weights_gbWeight: 6000,
		weights_designWeight: 6000,
		weights_kerbWeight: 4000,
		weights_ladenWeight: 6000,
		tyres_tyreCode: 428,
		tyres_tyreSize: '315/80-22.5',
		tyres_fitmentCode: 'single',
		tyres_speedCategorySymbol: 'j',
	};
}

export function createPSVAxles(noAxles: number): PSVAxlesComplete[] {
	return Array.from({ length: noAxles }, (_, index) => createPSVAxle(index + 1));
}

export function createTRLAxle(axleNumber = 1): TRLAxles {
	return {
		axleNumber,
		parkingBrakeMrk: true,
		brakes_brakeActuator: 20,
		brakes_leverLength: 150,
		weights_gbWeight: 9000,
		weights_designWeight: 9000,
		tyres_tyreCode: 428,
		tyres_tyreSize: '315/80-22.5',
		tyres_fitmentCode: 'single',
	};
}

export function createTRLAxles(noAxles: number): TRLAxles[] {
	return Array.from({ length: noAxles }, (_, index) => createTRLAxle(index + 1));
}
