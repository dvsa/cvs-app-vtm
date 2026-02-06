import { Injectable, inject } from '@angular/core';
import { TestResultSchema } from '@dvsa/cvs-type-definitions/types/v1/test-result';
import { Store } from '@ngrx/store';
import { HttpService } from '@services/http/http.service';
import { testTypeIdChanged } from '@store/test-records';
import { fetchTestTypes } from '@store/test-types/test-types.actions';
import { selectTestTypesByVehicleType } from '@store/test-types/test-types.selectors';
import { VehicleTypes } from '../../models/vehicle-tech-record.model';

@Injectable({
	providedIn: 'root',
})
export class TestTypesService {
	store = inject(Store);
	httpService = inject(HttpService);

	selectAllTestTypes$ = this.store.select(selectTestTypesByVehicleType);

	fetchTestTypes(): void {
		this.store.dispatch(fetchTestTypes());
	}

	testTypeIdChanged(testTypeId: string): void {
		this.store.dispatch(testTypeIdChanged({ testTypeId }));
	}

	canTestTypeBeCreated(testTypeId: string | undefined): boolean {
		return false; // @TODO: implement
	}

	canHaveVehicleDetails(test: TestResultSchema): boolean {
		return true; // @TODO: implement
	}

	canHaveTestDetails(test: TestResultSchema): boolean {
		return true; // @TODO: implement
	}

	canHaveVisitDetails(test: TestResultSchema): boolean {
		return true; // @TODO: implement
	}

	canHaveSeatbeltDetails(test: TestResultSchema): boolean {
		if (test.vehicleType !== VehicleTypes.PSV) return false;
		return true; // @TODO: implement
	}

	canHaveNotes(test: TestResultSchema): boolean {
		return true; // @TODO: implement
	}

	canHaveEmissions(test: TestResultSchema): boolean {
		const testResult = test.testTypes[0]?.testResult;
		if (testResult === 'fail') return false;
		return true; // @TODO: implement
	}

	canHaveAdditionalDefects(test: TestResultSchema): boolean {
		return true; // @TODO: implement
	}

	canHaveReasonForCreation(test: TestResultSchema): boolean {
		return true; // @TODO: implement
	}

	canHaveCertificateNumber(test: TestResultSchema): boolean {
		if (this.isFailOrAbandon(test)) return false;
		return true; // @TODO: implement
	}

	canHaveSecondaryCertificateNumber(test: TestResultSchema): boolean {
		if (this.isFailOrAbandon(test)) return false;
		return true; // @TODO: implement
	}

	canHaveTestStartTimestamp(test: TestResultSchema): boolean {
		// @TODO: implement
		return true;
	}

	canHaveTestEndTimestamp(test: TestResultSchema): boolean {
		// @TODO: implement
		return true;
	}

	canHaveTestResult(test: TestResultSchema): boolean {
		return true; // @TODO: implement
	}

	canHaveProhibitionIssued(test: TestResultSchema): boolean {
		return true; // @TODO: implement
	}

	canHaveAdditionalNotesRecorded(test: TestResultSchema): boolean {
		return true; // @TODO: implement
	}

	canHaveAdditionalCommentsForAbandon(test: TestResultSchema): boolean {
		return true; // @TODO: implement
	}

	canHaveNumberOfSeatbeltsFitted(test: TestResultSchema): boolean {
		//  @TODO: implement
		return true;
	}

	canHaveLastSeatbeltInstallationCheckDate(test: TestResultSchema): boolean {
		//  @TODO: implement
		return true;
	}

	canHaveSeatbeltInstallationCheckDate(test: TestResultSchema): boolean {
		//  @TODO: implement
		return true;
	}

	canHaveTestExpiryDate(test: TestResultSchema): boolean {
		//  @TODO: implement
		return true;
	}

	canHaveTestAnniversaryDate(test: TestResultSchema): boolean {
		//  @TODO: implement
		return true;
	}

	canHaveModType(test: TestResultSchema): boolean {
		//  @TODO: implement
		return true;
	}

	canHaveEmissionsStandard(test: TestResultSchema): boolean {
		return true;
	}

	canHaveFuelType(test: TestResultSchema): boolean {
		return true;
	}

	canHaveReasonForAbandon(test: TestResultSchema): boolean {
		return true; // @TODO: implement
	}

	canHaveModificationType(test: TestResultSchema): boolean {
		return true;
	}

	canHaveModificationTypeUsed(test: TestResultSchema): boolean {
		return true;
	}

	canHaveSmokeTestKLimitApplied(test: TestResultSchema): boolean {
		return true;
	}

	canHaveParticulateTrapFitted(test: TestResultSchema): boolean {
		// @TODO: implement
		return true;
	}

	canHaveParticulateTrapSerialNumber(test: TestResultSchema): boolean {
		// @TODO: implement
		return true;
	}

	canHaveDefects(test: TestResultSchema): boolean {
		return true; // @TODO: implement
	}

	canHaveCustomDefects(test: TestResultSchema): boolean {
		return true; // @TODO: implement
	}

	canHaveRequiredStandards(test: TestResultSchema): boolean {
		return true; // @TODO: implement
	}

	canHaveTestNumber(test: TestResultSchema): boolean {
		//  @TODO: implement
		return true;
	}

	canHaveReapplicationDate(test: TestResultSchema): boolean {
		//  @TODO: implement
		return true;
	}

	canHaveCentralDocs(test: TestResultSchema): boolean {
		//  @TODO: implement
		return true;
	}

	testResultRequired(test: TestResultSchema): boolean {
		return true; // @TODO: implement
	}

	certifcateNumberRequired(test: TestResultSchema): boolean {
		return true; // @TODO: implement
	}

	emissionStandardRequired(test: TestResultSchema): boolean {
		return this.isFailOrAbandon(test);
	}

	isFailOrAbandon(test: TestResultSchema): boolean {
		const testResult = test.testTypes[0]?.testResult;
		return testResult === 'fail' || testResult === 'abandoned';
	}
}
