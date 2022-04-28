import { TechRecordSummaryComponent } from './tech-record-summary.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TechRecordModel, VehicleTypes, StatusCodes, FuelTypes, VehicleConfigurations, EuVehicleCategories, VehicleSizes } from '@models/vehicle-tech-record.model';
import { By } from '@angular/platform-browser';


describe('TechRecordSummaryComponent', () => {
    let component: TechRecordSummaryComponent;
    let fixture: ComponentFixture<TechRecordSummaryComponent>;
    const fakeTechRecord: TechRecordModel = {
        statusCode: StatusCodes.CURRENT,
        vehicleType: VehicleTypes.PSV,
        regnDate: "1234",
        manufactureYear: 2022,
        noOfAxles: 2,
        dtpNumber: "1234",
        axles: {
            parkingBrakeMrk: true
        },
        speedLimiterMrk: true,
        tachoExemptMrk: true,
        euroStandard: "123",
        fuelpropulsionsystem: FuelTypes.HYBRID,
        vehicleClass: {
            description: "Description",
        },
        vehicleConfiguration: VehicleConfigurations.ARTICULATED,
        euVehicleCategory: EuVehicleCategories.M1,
        emissionsLimit: 1234,
        seatsLowerDeck: 1234,
        seatsUpperDeck: 1234,
        standingCapacity: 1234,
        vehicleSize: VehicleSizes.SMALL,
        numberOfSeatbelts: "1234",
        seatbeltInstallationApprovalDate: "1234",
        departmentalVehicleMarker: true,
    }
    const fakeRecord = {
        systemNumber: `SYS`,
        vin: `XMGDE02FS0H0`,
        primaryVrm: `KP ABC`,
        secondaryVrms: [
        '609859Z',
        '609959Z'
        ],
        techRecord: [fakeTechRecord]
    }

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TechRecordSummaryComponent]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TechRecordSummaryComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should show record found', () => {
        component.vehicleTechRecord = fakeRecord;
        fixture.detectChanges();
    
        const heading = fixture.debugElement.query(By.css('.govuk-heading-s'));
        expect(heading).toBeFalsy();

        const form = fixture.nativeElement.querySelector('app-dynamic-form-group');
        expect(form).toBeTruthy();
    });
});