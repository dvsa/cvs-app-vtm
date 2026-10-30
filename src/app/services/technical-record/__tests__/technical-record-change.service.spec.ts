import { initialAppState } from '@/src/app/store';
import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { editingTechRecord, techRecord } from '@store/technical-records';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { FeatureToggleService } from '@services/feature-toggle-service/feature-toggle-service';
import { TechnicalRecordChangesService } from '../technical-record-change.service';

describe('TechnicalRecordChangesService', () => {
	let service: TechnicalRecordChangesService;
	let store: MockStore;
	let featureToggleService: FeatureToggleService;

	const setRecords = (current: unknown, amended: unknown) => {
		store.overrideSelector(techRecord, current as never);
		store.overrideSelector(editingTechRecord, amended as never);
		store.refreshState();
	};

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [provideMockStore({ initialState: initialAppState }), TechnicalRecordChangesService],
		});
		store = TestBed.inject(MockStore);
		service = TestBed.inject(TechnicalRecordChangesService);
		featureToggleService = TestBed.inject(FeatureToggleService);
	});

	describe('change cache', () => {
		it('should report a change as soon as the amended record changes, without waiting for effects to flush', () => {
			setRecords({ vin: 'A' }, { vin: 'A' });
			TestBed.tick();
			expect(service.hasChanged('vin')).toBe(false);

			// the records change mid change-detection; effects have not run yet
			setRecords({ vin: 'A' }, { vin: 'B' });

			expect(service.hasChanged('vin')).toBe(true);
		});

		it('should not serve cached answers once the amended record is cleared', () => {
			setRecords({ vin: 'A' }, { vin: 'A' });
			TestBed.tick();
			expect(service.hasChanged('vin')).toBe(false);

			// leaving edit mode clears the editing record; with no pair to compare, everything counts as changed
			setRecords({ vin: 'A' }, undefined);
			TestBed.tick();

			expect(service.hasChanged('vin')).toBe(true);
		});

		it('should cache the result of a property lookup and reuse it on subsequent calls', () => {
			setRecords({ vin: 'A' }, { vin: 'A' });
			TestBed.tick();

			expect(service.hasChanged('vin')).toBe(false);
			// call again - should hit the cache branch (cachedValue is boolean)
			expect(service.hasChanged('vin')).toBe(false);
		});
	});

	describe('hasChanged', () => {
		it('should return true if any of the given properties have changed', () => {
			setRecords({ a: '1', b: '2' }, { a: '1', b: '3' });
			TestBed.tick();

			expect(service.hasChanged('a', 'b')).toBe(true);
		});

		it('should return false if none of the given properties have changed', () => {
			setRecords({ a: '1', b: '2' }, { a: '1', b: '2' });
			TestBed.tick();

			expect(service.hasChanged('a', 'b')).toBe(false);
		});

		it('should return true when either record is missing', () => {
			setRecords(undefined, undefined);
			TestBed.tick();

			expect(service.hasChanged('a')).toBe(true);
		});
	});

	describe('_isNotEqual edge cases (via hasChanged)', () => {
		it('should not count null -> "" as a change', () => {
			setRecords({ a: null }, { a: '' });
			TestBed.tick();
			expect(service.hasChanged('a')).toBe(false);
		});

		it('should not count "" -> null as a change', () => {
			setRecords({ a: '' }, { a: null });
			TestBed.tick();
			expect(service.hasChanged('a')).toBe(false);
		});

		it('should not count null -> undefined as a change', () => {
			setRecords({ a: null }, { a: undefined });
			TestBed.tick();
			expect(service.hasChanged('a')).toBe(false);
		});

		it('should not count null -> [] as a change', () => {
			setRecords({ a: null }, { a: [] });
			TestBed.tick();
			expect(service.hasChanged('a')).toBe(false);
		});

		it('should not count null -> false as a change', () => {
			setRecords({ a: null }, { a: false });
			TestBed.tick();
			expect(service.hasChanged('a')).toBe(false);
		});

		it('should not count [] -> non-null value as a change', () => {
			setRecords({ a: [] }, { a: 'something' });
			TestBed.tick();
			expect(service.hasChanged('a')).toBe(false);
		});

		it('should recursively compare array values and detect a change within elements', () => {
			setRecords({ a: [1, 2] }, { a: [1, 3] });
			TestBed.tick();
			expect(service.hasChanged('a')).toBe(true);
		});

		it('should recursively compare array values and detect no change when elements are equal', () => {
			setRecords({ a: [1, 2] }, { a: [1, 2] });
			TestBed.tick();
			expect(service.hasChanged('a')).toBe(false);
		});

		it('should detect a real change between two concrete values', () => {
			setRecords({ a: 'foo' }, { a: 'bar' });
			TestBed.tick();
			expect(service.hasChanged('a')).toBe(true);
		});
	});

	describe('hasSectionChanged', () => {
		it.each(['requiredSection', 'reasonForCreationSection'])('should always return true for %s', (section) => {
			setRecords({ vin: 'A' }, { vin: 'A' });
			TestBed.tick();
			expect(service.hasSectionChanged(section)).toBe(true);
		});

		it('should return true for an unknown section name (default case)', () => {
			setRecords({ vin: 'A' }, { vin: 'A' });
			TestBed.tick();
			expect(service.hasSectionChanged('someUnknownSection')).toBe(true);
		});

		it('should delegate to hasNotesSectionChanged for notesSection', () => {
			const spy = vi.spyOn(service, 'hasNotesSectionChanged').mockReturnValue(true);
			expect(service.hasSectionChanged('notesSection')).toBe(true);
			expect(spy).toHaveBeenCalled();
		});

		it('should delegate to hasVehicleSummarySectionChanged for techRecordSummary', () => {
			const spy = vi.spyOn(service, 'hasVehicleSummarySectionChanged').mockReturnValue(true);
			expect(service.hasSectionChanged('techRecordSummary')).toBe(true);
			expect(spy).toHaveBeenCalled();
		});

		it('should delegate to hasBodySectionChanged for bodySection', () => {
			const spy = vi.spyOn(service, 'hasBodySectionChanged').mockReturnValue(true);
			expect(service.hasSectionChanged('bodySection')).toBe(true);
			expect(spy).toHaveBeenCalled();
		});

		it('should delegate to hasDimensionsSectionChanged for dimensionsSection', () => {
			const spy = vi.spyOn(service, 'hasDimensionsSectionChanged').mockReturnValue(true);
			expect(service.hasSectionChanged('dimensionsSection')).toBe(true);
			expect(spy).toHaveBeenCalled();
		});

		it('should delegate to hasPurchaserSectionChanged for purchaserSection', () => {
			const spy = vi.spyOn(service, 'hasPurchaserSectionChanged').mockReturnValue(true);
			expect(service.hasSectionChanged('purchaserSection')).toBe(true);
			expect(spy).toHaveBeenCalled();
		});

		it('should delegate to hasApprovalSectionChanged for approvalSection', () => {
			const spy = vi.spyOn(service, 'hasApprovalSectionChanged').mockReturnValue(true);
			expect(service.hasSectionChanged('approvalSection')).toBe(true);
			expect(spy).toHaveBeenCalled();
		});

		it.each(['psvBrakesSection', 'trlBrakesSection'])('should delegate to hasBrakesSectionChanged for %s', (section) => {
			const spy = vi.spyOn(service, 'hasBrakesSectionChanged').mockReturnValue(true);
			expect(service.hasSectionChanged(section)).toBe(true);
			expect(spy).toHaveBeenCalled();
		});

		it('should delegate to hasDDASectionChanged for dda', () => {
			const spy = vi.spyOn(service, 'hasDDASectionChanged').mockReturnValue(true);
			expect(service.hasSectionChanged('dda')).toBe(true);
			expect(spy).toHaveBeenCalled();
		});

		it('should delegate to hasTyresSectionChanged for tyreSection', () => {
			const spy = vi.spyOn(service, 'hasTyresSectionChanged').mockReturnValue(true);
			expect(service.hasSectionChanged('tyreSection')).toBe(true);
			expect(spy).toHaveBeenCalled();
		});

		it('should delegate to hasWeightSectionChanged for weightsSection', () => {
			const spy = vi.spyOn(service, 'hasWeightSectionChanged').mockReturnValue(true);
			expect(service.hasSectionChanged('weightsSection')).toBe(true);
			expect(spy).toHaveBeenCalled();
		});

		it('should delegate to hasADRSectionChanged for adrSection', () => {
			const spy = vi.spyOn(service, 'hasADRSectionChanged').mockReturnValue(true);
			expect(service.hasSectionChanged('adrSection')).toBe(true);
			expect(spy).toHaveBeenCalled();
		});

		it('should delegate to hasLastApplicantSectionChanged for techRecord', () => {
			const spy = vi.spyOn(service, 'hasLastApplicantSectionChanged').mockReturnValue(true);
			expect(service.hasSectionChanged('techRecord')).toBe(true);
			expect(spy).toHaveBeenCalled();
		});

		it('should delegate to hasDocumentsSectionChanged for documentsSection', () => {
			const spy = vi.spyOn(service, 'hasDocumentsSectionChanged').mockReturnValue(true);
			expect(service.hasSectionChanged('documentsSection')).toBe(true);
			expect(spy).toHaveBeenCalled();
		});

		it('should delegate to hasPlatesSectionChanged for platesSection', () => {
			const spy = vi.spyOn(service, 'hasPlatesSectionChanged').mockReturnValue(true);
			expect(service.hasSectionChanged('platesSection')).toBe(true);
			expect(spy).toHaveBeenCalled();
		});

		it('should delegate to hasADRCertificateSectionChanged for adrCertificateSection', () => {
			const spy = vi.spyOn(service, 'hasADRCertificateSectionChanged').mockReturnValue(true);
			expect(service.hasSectionChanged('adrCertificateSection')).toBe(true);
			expect(spy).toHaveBeenCalled();
		});

		it('should delegate to hasLettersSectionChanged for lettersSection', () => {
			const spy = vi.spyOn(service, 'hasLettersSectionChanged').mockReturnValue(true);
			expect(service.hasSectionChanged('lettersSection')).toBe(true);
			expect(spy).toHaveBeenCalled();
		});

		it('should delegate to hasAuthorisationIntoServiceSectionChanged for authorizationIntoServiceSection', () => {
			const spy = vi.spyOn(service, 'hasAuthorisationIntoServiceSectionChanged').mockReturnValue(true);
			expect(service.hasSectionChanged('authorizationIntoServiceSection')).toBe(true);
			expect(spy).toHaveBeenCalled();
		});

		it('should delegate to hasManufacturerSectionChanged for manufacturerSection', () => {
			const spy = vi.spyOn(service, 'hasManufacturerSectionChanged').mockReturnValue(true);
			expect(service.hasSectionChanged('manufacturerSection')).toBe(true);
			expect(spy).toHaveBeenCalled();
		});

		it('should delegate to hasAuditSectionChanged for audit', () => {
			const spy = vi.spyOn(service, 'hasAuditSectionChanged').mockReturnValue(true);
			expect(service.hasSectionChanged('audit')).toBe(true);
			expect(spy).toHaveBeenCalled();
		});
	});

	describe('section change helpers', () => {
		it('hasNotesSectionChanged should detect a change in notes', () => {
			setRecords({ techRecord_notes: 'a' }, { techRecord_notes: 'b' });
			TestBed.tick();
			expect(service.hasNotesSectionChanged()).toBe(true);
		});

		it('hasNotesSectionChanged should return false when nothing changed', () => {
			setRecords({ techRecord_notes: 'a' }, { techRecord_notes: 'a' });
			TestBed.tick();
			expect(service.hasNotesSectionChanged()).toBe(false);
		});

		it('hasVehicleSummarySectionChanged should detect a change', () => {
			setRecords({ techRecord_vehicleType: VehicleTypes.PSV }, { techRecord_vehicleType: VehicleTypes.HGV });
			TestBed.tick();
			expect(service.hasVehicleSummarySectionChanged()).toBe(true);
		});

		it('hasBodySectionChanged should detect a change', () => {
			setRecords({ techRecord_make: 'Volvo' }, { techRecord_make: 'Scania' });
			TestBed.tick();
			expect(service.hasBodySectionChanged()).toBe(true);
		});

		it('hasPurchaserSectionChanged should detect a change', () => {
			setRecords(
				{ techRecord_purchaserDetails_name: 'A' },
				{ techRecord_purchaserDetails_name: 'B' }
			);
			TestBed.tick();
			expect(service.hasPurchaserSectionChanged()).toBe(true);
		});

		it('hasApprovalSectionChanged should detect a change', () => {
			setRecords({ techRecord_approvalType: 'A' }, { techRecord_approvalType: 'B' });
			TestBed.tick();
			expect(service.hasApprovalSectionChanged()).toBe(true);
		});

		it('hasDDASectionChanged should detect a change', () => {
			setRecords({ techRecord_dda_certificateIssued: false }, { techRecord_dda_certificateIssued: true });
			TestBed.tick();
			expect(service.hasDDASectionChanged()).toBe(true);
		});

		it('hasLastApplicantSectionChanged should detect a change', () => {
			setRecords(
				{ techRecord_applicantDetails_name: 'A' },
				{ techRecord_applicantDetails_name: 'B' }
			);
			TestBed.tick();
			expect(service.hasLastApplicantSectionChanged()).toBe(true);
		});

		it('hasDocumentsSectionChanged should detect a change', () => {
			setRecords(
				{ techRecord_microfilm_microfilmRollNumber: '1' },
				{ techRecord_microfilm_microfilmRollNumber: '2' }
			);
			TestBed.tick();
			expect(service.hasDocumentsSectionChanged()).toBe(true);
		});

		it('hasPlatesSectionChanged should detect a change', () => {
			setRecords(
				{ techRecord_plates: [{ plateSerialNumber: '1' }] },
				{ techRecord_plates: [{ plateSerialNumber: '2' }] }
			);
			TestBed.tick();
			expect(service.hasPlatesSectionChanged()).toBe(true);
		});

		it('hasADRCertificateSectionChanged should detect a change', () => {
			setRecords({ techRecord_adrDetails_certificates: ['a'] }, { techRecord_adrDetails_certificates: ['b'] });
			TestBed.tick();
			expect(service.hasADRCertificateSectionChanged()).toBe(true);
		});

		it('hasLettersSectionChanged should detect a change', () => {
			setRecords(
				{ techRecord_letterOfAuth_letterIssuer: 'A' },
				{ techRecord_letterOfAuth_letterIssuer: 'B' }
			);
			TestBed.tick();
			expect(service.hasLettersSectionChanged()).toBe(true);
		});

		it('hasAuthorisationIntoServiceSectionChanged should detect a change', () => {
			setRecords(
				{ techRecord_authIntoService_dateReceived: 'A' },
				{ techRecord_authIntoService_dateReceived: 'B' }
			);
			TestBed.tick();
			expect(service.hasAuthorisationIntoServiceSectionChanged()).toBe(true);
		});

		it('hasManufacturerSectionChanged should detect a change', () => {
			setRecords(
				{ techRecord_manufacturerDetails_name: 'A' },
				{ techRecord_manufacturerDetails_name: 'B' }
			);
			TestBed.tick();
			expect(service.hasManufacturerSectionChanged()).toBe(true);
		});

		it('hasAuditSectionChanged should detect a change', () => {
			setRecords({ techRecord_createdByName: 'A' }, { techRecord_createdByName: 'B' });
			TestBed.tick();
			expect(service.hasAuditSectionChanged()).toBe(true);
		});

		it('haveAnyApplicantDetailItemsChanged should detect a change', () => {
			setRecords(
				{ techRecord_adrDetails_applicantDetails_name: 'A' },
				{ techRecord_adrDetails_applicantDetails_name: 'B' }
			);
			TestBed.tick();
			expect(service.haveAnyApplicantDetailItemsChanged()).toBe(true);
		});

		it('hasInitialInspectionChanged should detect a change', () => {
			setRecords(
				{ techRecord_adrDetails_tank_tankDetails_tc2Details_tc2IntermediateApprovalNo: '1' },
				{ techRecord_adrDetails_tank_tankDetails_tc2Details_tc2IntermediateApprovalNo: '2' }
			);
			TestBed.tick();
			expect(service.hasInitialInspectionChanged()).toBe(true);
		});

		it('haveAnyADRDetailItemsChanged should detect a change', () => {
			setRecords(
				{ techRecord_adrDetails_vehicleDetails_type: 'A' },
				{ techRecord_adrDetails_vehicleDetails_type: 'B' }
			);
			TestBed.tick();
			expect(service.haveAnyADRDetailItemsChanged()).toBe(true);
		});

		it('haveAnyTankDetailItemsChanged should detect a change', () => {
			setRecords(
				{ techRecord_adrDetails_tank_tankDetails_tankManufacturer: 'A' },
				{ techRecord_adrDetails_tank_tankDetails_tankManufacturer: 'B' }
			);
			TestBed.tick();
			expect(service.haveAnyTankDetailItemsChanged()).toBe(true);
		});

		it('haveAnyTankInspectionItemsChanged should detect a change', () => {
			setRecords(
				{ techRecord_adrDetails_tank_tankDetails_tc3Details: 'A' },
				{ techRecord_adrDetails_tank_tankDetails_tc3Details: 'B' }
			);
			TestBed.tick();
			expect(service.haveAnyTankInspectionItemsChanged()).toBe(true);
		});

		it('haveAnyMiscellaneousItemsChanged should detect a change', () => {
			setRecords({ techRecord_adrDetails_memosApply: false }, { techRecord_adrDetails_memosApply: true });
			TestBed.tick();
			expect(service.haveAnyMiscellaneousItemsChanged()).toBe(true);
		});

		it('haveAnyBatteryListItemsChanged should detect a change', () => {
			setRecords(
				{ techRecord_adrDetails_batteryListNumber: 'A' },
				{ techRecord_adrDetails_batteryListNumber: 'B' }
			);
			TestBed.tick();
			expect(service.haveAnyBatteryListItemsChanged()).toBe(true);
		});

		it('haveAnyDeclarationsSeenItemsChanged should detect a change', () => {
			setRecords(
				{ techRecord_adrDetails_brakeDeclarationsSeen: false },
				{ techRecord_adrDetails_brakeDeclarationsSeen: true }
			);
			TestBed.tick();
			expect(service.haveAnyDeclarationsSeenItemsChanged()).toBe(true);
		});

		it('hasConfigurationSectionChanged should detect a change', () => {
			setRecords({ techRecord_offRoad: false }, { techRecord_offRoad: true });
			TestBed.tick();
			expect(service.hasConfigurationSectionChanged()).toBe(true);
		});

		it('hasEmissionsAndExemptionsSectionChanged should detect a change', () => {
			setRecords({ techRecord_euroStandard: 'A' }, { techRecord_euroStandard: 'B' });
			TestBed.tick();
			expect(service.hasEmissionsAndExemptionsSectionChanged()).toBe(true);
		});

		it('hasSeatsAndVehicleSizeSectionChanged should detect a change', () => {
			setRecords({ techRecord_seatsUpperDeck: 10 }, { techRecord_seatsUpperDeck: 12 });
			TestBed.tick();
			expect(service.hasSeatsAndVehicleSizeSectionChanged()).toBe(true);
		});
	});

	describe('hasDimensionsSectionChanged / hasAxlesSpacingsChanged', () => {
		it('should return true when a dimension has changed', () => {
			setRecords({ techRecord_dimensions_length: 100 }, { techRecord_dimensions_length: 200 });
			TestBed.tick();
			expect(service.hasDimensionsSectionChanged()).toBe(true);
		});

		it('should return true when the axle spacing has changed', () => {
			setRecords(
				{ techRecord_noOfAxles: 2, techRecord_frontAxleToRearAxle: 100 },
				{ techRecord_noOfAxles: 2, techRecord_frontAxleToRearAxle: 200 }
			);
			TestBed.tick();
			expect(service.hasDimensionsSectionChanged()).toBe(true);
		});

		it('should ignore axle spacing changes when going from n-axle to 1-axle TRL', () => {
			setRecords(
				{ techRecord_noOfAxles: 2, techRecord_frontAxleToRearAxle: 100 },
				{ techRecord_noOfAxles: 1, techRecord_frontAxleToRearAxle: 200 }
			);
			TestBed.tick();
			expect(service.hasAxlesSpacingsChanged()).toBe(false);
		});
	});

	describe('hasBrakesSectionChanged', () => {
		it('should return true when a top-level brake property changes', () => {
			setRecords({ techRecord_brakes_brakeCode: 'A' }, { techRecord_brakes_brakeCode: 'B' });
			TestBed.tick();
			expect(service.hasBrakesSectionChanged()).toBe(true);
		});

		it('should return true when hasParkingBrakesSectionChanged returns true', () => {
			const spy = vi.spyOn(service, 'hasParkingBrakesSectionChanged').mockReturnValue(true);
			setRecords({ vin: 'A' }, { vin: 'A' });
			TestBed.tick();
			expect(service.hasBrakesSectionChanged()).toBe(true);
			expect(spy).toHaveBeenCalled();
		});

		it('should return true when hasTRLAxleBrakesChanged returns true', () => {
			vi.spyOn(service, 'hasParkingBrakesSectionChanged').mockReturnValue(false);
			const spy = vi.spyOn(service, 'hasTRLAxleBrakesChanged').mockReturnValue(true);
			setRecords({ vin: 'A' }, { vin: 'A' });
			TestBed.tick();
			expect(service.hasBrakesSectionChanged()).toBe(true);
			expect(spy).toHaveBeenCalled();
		});
	});

	describe('hasParkingBrakesSectionChanged', () => {
		it('should return false when axles have not changed', () => {
			setRecords({ techRecord_axles: [{ parkingBrakeMrk: true }] }, { techRecord_axles: [{ parkingBrakeMrk: true }] });
			TestBed.tick();
			expect(service.hasParkingBrakesSectionChanged()).toBe(false);
		});

		it('should return true when an axle parking brake marker has changed', () => {
			setRecords(
				{ techRecord_axles: [{ parkingBrakeMrk: true }] },
				{ techRecord_axles: [{ parkingBrakeMrk: false }] }
			);
			TestBed.tick();
			expect(service.hasParkingBrakesSectionChanged()).toBe(true);
		});

		it('should return true when either record is missing', () => {
			setRecords(undefined, undefined);
			TestBed.tick();
			expect(service.hasParkingBrakesSectionChanged()).toBe(true);
		});
	});

	describe('hasTyresSectionChanged', () => {
		it('should use techRecord_speedRestriction when feature flag is disabled', () => {
			vi.spyOn(featureToggleService, 'isFeatureEnabled').mockReturnValue(false);
			setRecords({ techRecord_speedRestriction: 'A' }, { techRecord_speedRestriction: 'B' });
			TestBed.tick();
			expect(service.hasTyresSectionChanged()).toBe(true);
		});

		it('should not consider techRecord_speedRestriction when feature flag is enabled', () => {
			vi.spyOn(featureToggleService, 'isFeatureEnabled').mockReturnValue(true);
			setRecords({ techRecord_speedRestriction: 'A' }, { techRecord_speedRestriction: 'B' });
			TestBed.tick();
			expect(service.hasTyresSectionChanged()).toBe(false);
		});

		it('should detect a change in techRecord_tyreUseCode regardless of flag state', () => {
			vi.spyOn(featureToggleService, 'isFeatureEnabled').mockReturnValue(true);
			setRecords({ techRecord_tyreUseCode: 'A' }, { techRecord_tyreUseCode: 'B' });
			TestBed.tick();
			expect(service.hasTyresSectionChanged()).toBe(true);
		});

		it('should return true when an axle tyre has changed', () => {
			setRecords(
				{ techRecord_axles: [{ tyres_tyreCode: 'A' }] },
				{ techRecord_axles: [{ tyres_tyreCode: 'B' }] }
			);
			TestBed.tick();
			expect(service.hasTyresSectionChanged()).toBe(true);
		});
	});

	describe('hasWeightSectionChanged', () => {
		it('should return true when an axle weight has changed', () => {
			setRecords(
				{ techRecord_axles: [{ weights_gbWeight: 100 }] },
				{ techRecord_axles: [{ weights_gbWeight: 200 }] }
			);
			TestBed.tick();
			expect(service.hasWeightSectionChanged()).toBe(true);
		});

		it('should return true when the vehicle is HGV/TRL and the brakes dtp number has changed', () => {
			setRecords(
				{ techRecord_vehicleType: VehicleTypes.HGV, techRecord_brakes_dtpNumber: '1' },
				{ techRecord_vehicleType: VehicleTypes.HGV, techRecord_brakes_dtpNumber: '2' }
			);
			TestBed.tick();
			expect(service.hasWeightSectionChanged()).toBe(true);
		});

		it('should ignore the brakes dtp number change for a PSV vehicle', () => {
			setRecords(
				{ techRecord_vehicleType: VehicleTypes.PSV, techRecord_brakes_dtpNumber: '1' },
				{ techRecord_vehicleType: VehicleTypes.PSV, techRecord_brakes_dtpNumber: '2' }
			);
			TestBed.tick();
			expect(service.hasWeightSectionChanged()).toBe(false);
		});

		it('should return true when a weight property has changed', () => {
			setRecords({ techRecord_grossGbWeight: 100 }, { techRecord_grossGbWeight: 200 });
			TestBed.tick();
			expect(service.hasWeightSectionChanged()).toBe(true);
		});
	});

	describe('hasADRSectionChanged / hasUNNumbersChanged', () => {
		it('should return true when an ADR property has changed', () => {
			setRecords(
				{ techRecord_adrDetails_dangerousGoods: false },
				{ techRecord_adrDetails_dangerousGoods: true }
			);
			TestBed.tick();
			expect(service.hasADRSectionChanged()).toBe(true);
		});

		it('should return true when hasUNNumbersChanged returns true', () => {
			const spy = vi.spyOn(service, 'hasUNNumbersChanged').mockReturnValue(true);
			setRecords({ vin: 'A' }, { vin: 'A' });
			TestBed.tick();
			expect(service.hasADRSectionChanged()).toBe(true);
			expect(spy).toHaveBeenCalled();
		});

		it('should not count a change from null to an array of falsy UN numbers', () => {
			setRecords(
				{ techRecord_adrDetails_tank_tankDetails_tankStatement_productListUnNo: null },
				{ techRecord_adrDetails_tank_tankDetails_tankStatement_productListUnNo: [null, undefined] }
			);
			TestBed.tick();
			expect(service.hasUNNumbersChanged()).toBe(false);
		});

		it('should detect a real change in UN numbers', () => {
			setRecords(
				{ techRecord_adrDetails_tank_tankDetails_tankStatement_productListUnNo: ['1'] },
				{ techRecord_adrDetails_tank_tankDetails_tankStatement_productListUnNo: ['2'] }
			);
			TestBed.tick();
			expect(service.hasUNNumbersChanged()).toBe(true);
		});

		it('should return true from hasUNNumbersChanged when either record is missing', () => {
			setRecords(undefined, undefined);
			TestBed.tick();
			expect(service.hasUNNumbersChanged()).toBe(true);
		});

		it('hasADRApplicantSectionChanged should detect a change', () => {
			setRecords(
				{ techRecord_adrDetails_applicantDetails_name: 'A' },
				{ techRecord_adrDetails_applicantDetails_name: 'B' }
			);
			TestBed.tick();
			expect(service.hasADRApplicantSectionChanged()).toBe(true);
		});

		it('hasADRTankDetailsSectionChanged should detect a change', () => {
			setRecords(
				{ techRecord_adrDetails_tank_tankDetails_tankManufacturer: 'A' },
				{ techRecord_adrDetails_tank_tankDetails_tankManufacturer: 'B' }
			);
			TestBed.tick();
			expect(service.hasADRTankDetailsSectionChanged()).toBe(true);
		});

		it('hasADRTankInspectionsSectionChanged should detect a change', () => {
			setRecords(
				{ techRecord_adrDetails_tank_tankDetails_tc3Details: 'A' },
				{ techRecord_adrDetails_tank_tankDetails_tc3Details: 'B' }
			);
			TestBed.tick();
			expect(service.hasADRTankInspectionsSectionChanged()).toBe(true);
		});
	});

	describe('hasGeneralVehicleDetailsSectionChanged', () => {
		it('should return true when the vehicle is PSV and the brakes dtp number has changed', () => {
			setRecords(
				{ techRecord_vehicleType: VehicleTypes.PSV, techRecord_brakes_dtpNumber: '1' },
				{ techRecord_vehicleType: VehicleTypes.PSV, techRecord_brakes_dtpNumber: '2' }
			);
			TestBed.tick();
			expect(service.hasGeneralVehicleDetailsSectionChanged()).toBe(true);
		});

		it('should ignore the brakes dtp number change for a non-PSV vehicle', () => {
			setRecords(
				{ techRecord_vehicleType: VehicleTypes.HGV, techRecord_brakes_dtpNumber: '1' },
				{ techRecord_vehicleType: VehicleTypes.HGV, techRecord_brakes_dtpNumber: '2' }
			);
			TestBed.tick();
			expect(service.hasGeneralVehicleDetailsSectionChanged()).toBe(false);
		});

		it('should return true when a general detail property has changed', () => {
			setRecords({ techRecord_make: 'A' }, { techRecord_make: 'B' });
			TestBed.tick();
			expect(service.hasGeneralVehicleDetailsSectionChanged()).toBe(true);
		});
	});

	describe('per-axle helpers', () => {
		it('hasTyreChanged should detect a change at the given axle index', () => {
			setRecords(
				{ techRecord_axles: [{}, { tyres_tyreSize: 'A' }] },
				{ techRecord_axles: [{}, { tyres_tyreSize: 'B' }] }
			);
			TestBed.tick();
			expect(service.hasTyreChanged(1)).toBe(true);
			expect(service.hasTyreChanged(0)).toBe(false);
		});

		it('hasWeightChanged should detect a change at the given axle index', () => {
			setRecords(
				{ techRecord_axles: [{ weights_gbWeight: 1 }] },
				{ techRecord_axles: [{ weights_gbWeight: 2 }] }
			);
			TestBed.tick();
			expect(service.hasWeightChanged(0)).toBe(true);
		});

		it('hasAxleWeightsChanged should return false when axles have not changed', () => {
			setRecords({ techRecord_axles: [{ weights_gbWeight: 1 }] }, { techRecord_axles: [{ weights_gbWeight: 1 }] });
			TestBed.tick();
			expect(service.hasAxleWeightsChanged()).toBe(false);
		});

		it('hasAxleWeightsChanged should return true when either record is missing', () => {
			setRecords(undefined, undefined);
			TestBed.tick();
			expect(service.hasAxleWeightsChanged()).toBe(true);
		});

		it('hasAxleTyresChanged should return false when axles have not changed', () => {
			setRecords({ techRecord_axles: [{ tyres_tyreCode: 'A' }] }, { techRecord_axles: [{ tyres_tyreCode: 'A' }] });
			TestBed.tick();
			expect(service.hasAxleTyresChanged()).toBe(false);
		});

		it('hasAxleTyresChanged should return true when either record is missing', () => {
			setRecords(undefined, undefined);
			TestBed.tick();
			expect(service.hasAxleTyresChanged()).toBe(true);
		});

		it('hasTRLAxleBrakeChanged should detect a change at the given axle index', () => {
			setRecords(
				{ techRecord_axles: [{ brakes_leverLength: '1' }] },
				{ techRecord_axles: [{ brakes_leverLength: '2' }] }
			);
			TestBed.tick();
			expect(service.hasTRLAxleBrakeChanged(0)).toBe(true);
		});

		it('hasTRLAxleBrakesChanged should return false when axles have not changed', () => {
			setRecords(
				{ techRecord_vehicleType: VehicleTypes.TRL, techRecord_axles: [{ brakes_leverLength: '1' }] },
				{ techRecord_vehicleType: VehicleTypes.TRL, techRecord_axles: [{ brakes_leverLength: '1' }] }
			);
			TestBed.tick();
			expect(service.hasTRLAxleBrakesChanged()).toBe(false);
		});

		it('hasTRLAxleBrakesChanged should return false when the vehicle type is not TRL', () => {
			setRecords(
				{ techRecord_vehicleType: VehicleTypes.HGV, techRecord_axles: [{ brakes_leverLength: '1' }] },
				{ techRecord_vehicleType: VehicleTypes.HGV, techRecord_axles: [{ brakes_leverLength: '2' }] }
			);
			TestBed.tick();
			expect(service.hasTRLAxleBrakesChanged()).toBe(false);
		});

		it('hasTRLAxleBrakesChanged should return true when a TRL axle brake has changed', () => {
			setRecords(
				{ techRecord_vehicleType: VehicleTypes.TRL, techRecord_axles: [{ brakes_leverLength: '1' }] },
				{ techRecord_vehicleType: VehicleTypes.TRL, techRecord_axles: [{ brakes_leverLength: '2' }] }
			);
			TestBed.tick();
			expect(service.hasTRLAxleBrakesChanged()).toBe(true);
		});

		it('hasTRLAxleBrakesChanged should return true when either record is missing', () => {
			setRecords(undefined, undefined);
			TestBed.tick();
			expect(service.hasTRLAxleBrakesChanged()).toBe(true);
		});
	});
});
