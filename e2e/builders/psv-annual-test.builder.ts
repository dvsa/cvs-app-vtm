import { randomInt, randomUUID } from 'node:crypto';
import { OdometerReadingUnits } from '@dvsa/cvs-type-definitions/types/v1/enums/odometerReadingUnits.enum.js';
import { TestSources } from '@dvsa/cvs-type-definitions/types/v1/enums/sources.enum.js';
import { TestResults } from '@dvsa/cvs-type-definitions/types/v1/enums/testResult.enum.js';
import { TestStatus } from '@dvsa/cvs-type-definitions/types/v1/enums/testStatus.enum.js';
import { TypeOfTest } from '@dvsa/cvs-type-definitions/types/v1/enums/typeOfTest.enum.js';
import type { TestResultSchema } from '@dvsa/cvs-type-definitions/types/v1/test-result';
import { EUVehicleCategory } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/euVehicleCategory.enum.js';
import type { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb-vehicle-type';
import type { CreatedTechnicalRecord } from '../api/technical-records.api';
import type { TestVisit } from '../api/test-results.api';
import { registrationPlateDefect } from './helpers/test-defects';

export const annualAbandonReason = 'Current Health and Safety legislation cannot be met in testing the vehicle';

export class PsvAnnualTestBuilder {
	private record: TestResultSchema;

	constructor(vehicle: TechRecordType<'psv', 'put'>, reference: CreatedTechnicalRecord, visit: TestVisit) {
		if (!vehicle.primaryVrm || !vehicle.techRecord_noOfAxles || !vehicle.techRecord_vehicleConfiguration) {
			throw new Error('Annual tests require a testable PSV with a VRM.');
		}
		if (vehicle.vin !== reference.vin) throw new Error('Test vehicle must match the created technical record.');
		const end = new Date();
		end.setUTCDate(end.getUTCDate() - 1);
		end.setUTCSeconds(0, 0);
		const start = new Date(end.getTime() - 20 * 60_000).toISOString();
		const expiry = new Date(end);
		expiry.setUTCFullYear(expiry.getUTCFullYear() + 1);
		this.record = {
			testResultId: randomUUID(),
			systemNumber: reference.systemNumber,
			vin: reference.vin,
			vrm: vehicle.primaryVrm,
			vehicleType: 'psv',
			vehicleClass: { code: '2', description: vehicle.techRecord_vehicleClass_description },
			vehicleConfiguration: vehicle.techRecord_vehicleConfiguration,
			vehicleSize: vehicle.techRecord_vehicleSize ?? undefined,
			numberOfSeats: (vehicle.techRecord_seatsLowerDeck ?? 0) + (vehicle.techRecord_seatsUpperDeck ?? 0),
			noOfAxles: vehicle.techRecord_noOfAxles,
			numberOfWheelsDriven: null,
			countryOfRegistration: 'gb',
			euVehicleCategory: EUVehicleCategory.M3,
			odometerReading: 12345,
			odometerReadingUnits: OdometerReadingUnits.KILOMETRES,
			preparerId: null,
			preparerName: null,
			testStartTimestamp: start,
			testEndTimestamp: end.toISOString(),
			testStatus: TestStatus.SUBMITTED,
			reasonForCancellation: null,
			reasonForCreation: 'Annual contingency test regression',
			createdByName: visit.testerName ?? undefined,
			createdById: visit.testerStaffId,
			createdByEmailAddress: visit.testerEmailAddress ?? undefined,
			contingencyTestNumber: String(randomInt(10_000_000, 100_000_000)),
			typeOfTest: TypeOfTest.CONTINGENCY,
			source: TestSources.VTM,
			...visit,
			testTypes: [
				{
					testTypeId: '1',
					name: 'Annual test',
					testTypeName: 'Annual test',
					certificateNumber: null,
					secondaryCertificateNumber: null,
					testTypeStartTimestamp: start,
					testTypeEndTimestamp: end.toISOString(),
					testResult: TestResults.PASS,
					prohibitionIssued: false,
					reasonForAbandoning: null,
					additionalNotesRecorded: 'Group 1 contingency regression',
					additionalCommentsForAbandon: null,
					testExpiryDate: expiry.toISOString(),
					seatbeltInstallationCheckDate: true,
					numberOfSeatbeltsFitted: 30,
					lastSeatbeltInstallationCheckDate: start,
					defects: [],
					customDefects: [],
				},
			],
		};
	}

	withReason(reason: string): this {
		this.record.reasonForCreation = reason;
		return this;
	}

	withOdometerReading(reading: number): this {
		this.record.odometerReading = reading;
		return this;
	}

	withSeatbelts(count: number, checkedOn: string): this {
		this.record.testTypes[0].seatbeltInstallationCheckDate = true;
		this.record.testTypes[0].numberOfSeatbeltsFitted = count;
		this.record.testTypes[0].lastSeatbeltInstallationCheckDate = checkedOn;
		return this;
	}

	fail(): this {
		this.record.testTypes[0].testResult = TestResults.FAIL;
		this.record.testTypes[0].defects = [registrationPlateDefect()];
		return this;
	}

	prs(): this {
		this.record.testTypes[0].testResult = TestResults.PRS;
		this.record.testTypes[0].defects = [registrationPlateDefect(true)];
		return this;
	}

	abandoned(): this {
		this.record.testTypes[0].testResult = TestResults.ABANDONED;
		this.record.testTypes[0].reasonForAbandoning = annualAbandonReason;
		this.record.testTypes[0].additionalCommentsForAbandon = 'Presenter unable to provide safe access to the vehicle';
		return this;
	}

	build(): TestResultSchema {
		return structuredClone(this.record);
	}
}
