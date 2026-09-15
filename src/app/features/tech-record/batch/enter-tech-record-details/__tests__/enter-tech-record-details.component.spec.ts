import { GlobalErrorService } from '@/src/app/core/components/global-error/global-error.service';
import { BatchRoutes, RootRoutes } from '@/src/app/models/routes.enum';
import { VehicleConfiguration } from '@/src/app/models/vehicle-configuration.enum';
import { BatchUpdateVehicleModel, StatusCodes, VehicleTypes } from '@/src/app/models/vehicle-tech-record.model';
import { AxlesService } from '@/src/app/services/axles/axles.service';
import { MultiOptionsService } from '@/src/app/services/multi-options/multi-options.service';
import { TechnicalRecordService } from '@/src/app/services/technical-record/technical-record.service';
import { UserService } from '@/src/app/services/user-service/user-service';
import { initialAppState } from '@/src/app/store';
import { createVehicleRecord, editingTechRecord, updateTechRecord } from '@/src/app/store/technical-records';
import { selectBatchDetails } from '@/src/app/store/technical-records/batch-create.selectors';
import { AxlesServiceMock } from '@/src/mocks/axles-service.mock';
import { GlobalErrorServiceMock } from '@/src/mocks/global-error-service.mock';
import { MultiOptionsServiceMock } from '@/src/mocks/multi-options-service.mock';
import { TechnicalRecordServiceMock, mockTechRecord } from '@/src/mocks/technical-record-service.mock';
import { UserServiceMock } from '@/src/mocks/user-service.mock';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb-vehicle-type';
import { ScannedActionsSubject } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { EnterTechRecordDetailsComponent } from '../enter-tech-record-details.component';

const mockSavedBatchDetails = {
	batchSize: 1,
	trlFormType: undefined,
	vehicleStatus: StatusCodes.CURRENT,
	vehicleType: VehicleTypes.HGV,
	vehicles: [
		{
			vin: '123456',
			systemNumber: '123456',
			createdTimestamp: '2022-01-01T00:00:00.000Z',
			trailerIdOrVrm: '123456',
		},
	],
};
describe('EnterTechRecordDetailsComponent', () => {
	let fixture: ComponentFixture<EnterTechRecordDetailsComponent>;
	let component: EnterTechRecordDetailsComponent;
	let router: Router;
	let store: MockStore;
	let errorService: GlobalErrorService;
	let technicalRecordService: TechnicalRecordService;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [EnterTechRecordDetailsComponent],
			providers: [
				provideRouter([
					{
						path: `${RootRoutes.BATCH}/${BatchRoutes.BATCH_SUMMARY}`,
						component: jest.fn(),
					},
				]),
				provideMockStore({ initialState: initialAppState }),
				{ provide: GlobalErrorService, useValue: GlobalErrorServiceMock },
				{ provide: UserService, useValue: UserServiceMock },
				{ provide: MultiOptionsService, useValue: MultiOptionsServiceMock },
				{ provide: TechnicalRecordService, useValue: TechnicalRecordServiceMock },
				{ provide: AxlesService, useValue: AxlesServiceMock },
				ScannedActionsSubject,
			],
		}).compileComponents();

		store = TestBed.inject(MockStore);
		router = TestBed.inject(Router);
		errorService = TestBed.inject(GlobalErrorService);
		technicalRecordService = TestBed.inject(TechnicalRecordService);

		fixture = TestBed.createComponent(EnterTechRecordDetailsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('handleSave', () => {
		beforeEach(() => {
			store.overrideSelector(editingTechRecord, mockTechRecord);
		});

		it('should call set error if there are errors', () => {
			const errors = [{ error: 'some error', anchorLink: 'expected' }];

			jest.spyOn(errorService, 'setErrors');
			jest.spyOn(errorService, 'extractGlobalErrors').mockReturnValue(errors);

			store.refreshState();

			component.handleSave();

			expect(errorService.setErrors).toHaveBeenCalledWith(errors);
		});

		it('should dispatch updateTechRecord for each vehicle if the form is valid, and each vehicle has a VRM/Trailer ID', () => {
			jest.spyOn(store, 'dispatch');
			jest.spyOn(router, 'navigate');
			jest.spyOn(technicalRecordService, 'updateEditingTechRecord');
			jest.spyOn(technicalRecordService, 'clearSectionTemplateStates');
			jest.spyOn(errorService, 'extractGlobalErrors').mockReturnValue([]);

			store.overrideSelector(selectBatchDetails, mockSavedBatchDetails);

			component.handleSave();

			expect(technicalRecordService.updateEditingTechRecord).toHaveBeenCalledWith({
				techRecord_vehicleType: VehicleTypes.HGV,
				vin: '123456',
				primaryVrm: '123456',
				systemNumber: '123456',
				techRecord_bodyType_description: '',
				techRecord_noOfAxles: 2,
				techRecord_reasonForCreation: 'test',
				techRecord_vehicleClass_description: 'heavy goods vehicle',
				techRecord_vehicleConfiguration: VehicleConfiguration.ARTICULATED,
				createdTimestamp: '2022-01-01T00:00:00.000Z',
				techRecord_statusCode: 'current',
				techRecord_adrDetails_additionalExaminerNotes: null,
				techRecord_adrDetails_additionalNotes_guidanceNotes: null,
				techRecord_adrDetails_additionalNotes_number: null,
				techRecord_adrDetails_adrCertificateNotes: null,
				techRecord_adrDetails_adrTypeApprovalNo: null,
				techRecord_adrDetails_applicantDetails_city: null,
				techRecord_adrDetails_applicantDetails_name: null,
				techRecord_adrDetails_applicantDetails_postcode: null,
				techRecord_adrDetails_applicantDetails_street: null,
				techRecord_adrDetails_applicantDetails_town: null,
				techRecord_adrDetails_applicationNumber: null,
				techRecord_adrDetails_approved: null,
				techRecord_adrDetails_batteryListNumber: null,
				techRecord_adrDetails_bodyDeclaration_type: null,
				techRecord_adrDetails_brakeDeclarationIssuer: null,
				techRecord_adrDetails_brakeDeclarationsSeen: null,
				techRecord_adrDetails_brakeEndurance: null,
				techRecord_adrDetails_compatibilityGroupJ: null,
				techRecord_adrDetails_declarationsSeen: null,
				techRecord_adrDetails_documents: null,
				techRecord_adrDetails_listStatementApplicable: null,
				techRecord_adrDetails_m145Statement: null,
				techRecord_adrDetails_memosApply: null,
				techRecord_adrDetails_newCertificateRequested: null,
				techRecord_adrDetails_permittedDangerousGoods: null,
				techRecord_adrDetails_receivedDate: null,
				techRecord_adrDetails_tank_tankDetails_specialProvisions: null,
				techRecord_adrDetails_tank_tankDetails_tankCode: null,
				techRecord_adrDetails_tank_tankDetails_tankManufacturer: null,
				techRecord_adrDetails_tank_tankDetails_tankManufacturerSerialNo: null,
				techRecord_adrDetails_tank_tankDetails_tankStatement_productList: null,
				techRecord_adrDetails_tank_tankDetails_tankStatement_productListRefNo: null,
				techRecord_adrDetails_tank_tankDetails_tankStatement_productListUnNo: null,
				techRecord_adrDetails_tank_tankDetails_tankStatement_select: null,
				techRecord_adrDetails_tank_tankDetails_tankStatement_statement: null,
				techRecord_adrDetails_tank_tankDetails_tankStatement_substancesPermitted: null,
				techRecord_adrDetails_tank_tankDetails_tankTypeAppNo: null,
				techRecord_adrDetails_tank_tankDetails_tc2Details_tc2IntermediateApprovalNo: null,
				techRecord_adrDetails_tank_tankDetails_tc2Details_tc2IntermediateExpiryDate: null,
				techRecord_adrDetails_tank_tankDetails_tc2Details_tc2Type: null,
				techRecord_adrDetails_tank_tankDetails_tc3Details: null,
				techRecord_adrDetails_tank_tankDetails_yearOfManufacture: null,
				techRecord_adrDetails_vehicleDetails_approvalDate: null,
				techRecord_adrDetails_vehicleDetails_type: null,
				techRecord_adrDetails_vehicleDetails_usedOnInternationalJourneys: null,
				techRecord_adrDetails_weight: null,
			} as unknown as TechRecordType<'hgv', 'put'>);

			expect(store.dispatch).toHaveBeenCalledWith(
				updateTechRecord({
					systemNumber: '123456',
					createdTimestamp: '2022-01-01T00:00:00.000Z',
					groupType: 'batch',
					vin: '123456',
				})
			);

			expect(technicalRecordService.clearSectionTemplateStates).toHaveBeenCalled();
			expect(router.navigate).toHaveBeenCalledWith([RootRoutes.BATCH, BatchRoutes.BATCH_SUMMARY]);
		});

		it('should dispatch createVehicleRecord for each vehicle if the form is valid, and each vehicle does not have a VRM/Trailer ID', () => {
			jest.spyOn(store, 'dispatch');
			jest.spyOn(router, 'navigate');
			jest.spyOn(errorService, 'extractGlobalErrors').mockReturnValue([]);

			store.overrideSelector(selectBatchDetails, {
				...mockSavedBatchDetails,
				vehicles: [
					{
						vin: '123456',
						trailerIdOrVrm: undefined,
					},
				],
			});

			component.handleSave();

			expect(store.dispatch).toHaveBeenCalledWith(
				createVehicleRecord({
					vehicle: {
						createdTimestamp: undefined,
						systemNumber: undefined,
						techRecord_adrDetails_additionalExaminerNotes: null,
						techRecord_adrDetails_additionalNotes_guidanceNotes: null,
						techRecord_adrDetails_additionalNotes_number: null,
						techRecord_adrDetails_adrCertificateNotes: null,
						techRecord_adrDetails_adrTypeApprovalNo: null,
						techRecord_adrDetails_applicantDetails_city: null,
						techRecord_adrDetails_applicantDetails_name: null,
						techRecord_adrDetails_applicantDetails_postcode: null,
						techRecord_adrDetails_applicantDetails_street: null,
						techRecord_adrDetails_applicantDetails_town: null,
						techRecord_adrDetails_applicationNumber: null,
						techRecord_adrDetails_approved: null,
						techRecord_adrDetails_batteryListNumber: null,
						techRecord_adrDetails_bodyDeclaration_type: null,
						techRecord_adrDetails_brakeDeclarationIssuer: null,
						techRecord_adrDetails_brakeDeclarationsSeen: null,
						techRecord_adrDetails_brakeEndurance: null,
						techRecord_adrDetails_compatibilityGroupJ: null,
						techRecord_adrDetails_declarationsSeen: null,
						techRecord_adrDetails_documents: null,
						techRecord_adrDetails_listStatementApplicable: null,
						techRecord_adrDetails_m145Statement: null,
						techRecord_adrDetails_memosApply: null,
						techRecord_adrDetails_newCertificateRequested: null,
						techRecord_adrDetails_permittedDangerousGoods: null,
						techRecord_adrDetails_receivedDate: null,
						techRecord_adrDetails_tank_tankDetails_specialProvisions: null,
						techRecord_adrDetails_tank_tankDetails_tankCode: null,
						techRecord_adrDetails_tank_tankDetails_tankManufacturer: null,
						techRecord_adrDetails_tank_tankDetails_tankManufacturerSerialNo: null,
						techRecord_adrDetails_tank_tankDetails_tankStatement_productList: null,
						techRecord_adrDetails_tank_tankDetails_tankStatement_productListRefNo: null,
						techRecord_adrDetails_tank_tankDetails_tankStatement_productListUnNo: null,
						techRecord_adrDetails_tank_tankDetails_tankStatement_select: null,
						techRecord_adrDetails_tank_tankDetails_tankStatement_statement: null,
						techRecord_adrDetails_tank_tankDetails_tankStatement_substancesPermitted: null,
						techRecord_adrDetails_tank_tankDetails_tankTypeAppNo: null,
						techRecord_adrDetails_tank_tankDetails_tc2Details_tc2IntermediateApprovalNo: null,
						techRecord_adrDetails_tank_tankDetails_tc2Details_tc2IntermediateExpiryDate: null,
						techRecord_adrDetails_tank_tankDetails_tc2Details_tc2Type: null,
						techRecord_adrDetails_tank_tankDetails_tc3Details: null,
						techRecord_adrDetails_tank_tankDetails_yearOfManufacture: null,
						techRecord_adrDetails_vehicleDetails_approvalDate: null,
						techRecord_adrDetails_vehicleDetails_type: null,
						techRecord_adrDetails_vehicleDetails_usedOnInternationalJourneys: null,
						techRecord_adrDetails_weight: null,
						techRecord_bodyType_description: '',
						techRecord_noOfAxles: 2,
						techRecord_reasonForCreation: 'test',
						techRecord_statusCode: 'current',
						techRecord_vehicleClass_description: 'heavy goods vehicle',
						techRecord_vehicleConfiguration: VehicleConfiguration.ARTICULATED,
						techRecord_vehicleType: 'hgv',
						vin: '123456',
					} as unknown as BatchUpdateVehicleModel,
				})
			);
			expect(technicalRecordService.clearSectionTemplateStates).toHaveBeenCalled();
			expect(router.navigate).toHaveBeenCalledWith([RootRoutes.BATCH, BatchRoutes.BATCH_SUMMARY]);
		});
	});
});
