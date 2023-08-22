import { APP_BASE_HREF } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { DynamicFormsModule } from '@forms/dynamic-forms.module';
import { Roles } from '@models/roles.enum';
import { Plates, V3TechRecordModel } from '@models/vehicle-tech-record.model';
import { StoreModule } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { UserService } from '@services/user-service/user-service';
import { SharedModule } from '@shared/shared.module';
import { State, initialAppState } from '@store/index';
import { of } from 'rxjs';
import { PlatesComponent } from './plates.component';
import { TRLPlates } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/trl/complete';

describe('PlatesComponent', () => {
  let component: PlatesComponent;
  let fixture: ComponentFixture<PlatesComponent>;
  let route: ActivatedRoute;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicFormsModule, SharedModule, StoreModule.forRoot({}), HttpClientTestingModule, RouterModule.forRoot([]), RouterTestingModule],
      declarations: [PlatesComponent],
      providers: [
        provideMockStore<State>({ initialState: initialAppState }),
        {
          provide: UserService,
          useValue: {
            roles$: of([Roles.TechRecordAmend])
          }
        },
        {
          provide: ActivatedRoute,
          useValue: {
            useValue: { params: of([{ id: 1 }]) }
          }
        },
        {
          provide: APP_BASE_HREF,
          useValue: '/'
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlatesComponent);
    component = fixture.componentInstance;
    route = TestBed.inject(ActivatedRoute);
    router = TestBed.inject(Router);
    component.techRecord = { systemNumber: 'foo', createdTimestamp: 'bar', vin: 'testVin' } as TechRecordType<'trl'>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('mostRecentPlate', () => {
    it('should fetch the plate if only 1 exists', () => {
      (component.techRecord as TechRecordType<'trl'>).techRecord_plates = [
        {
          plateIssueDate: new Date().toISOString(),
          plateSerialNumber: '123456',
          plateIssuer: 'issuer',
          plateReasonForIssue: 'Replacement'
        }
      ];
      const plateFetched = component.mostRecentPlate;

      expect(plateFetched).toBeDefined();
      expect(plateFetched!.plateSerialNumber).toEqual('123456');
    });

    //TODO: Remove the anys
    it('should fetch the latest plate if more than 1 exists', () => {
      component.techRecord = {
        techRecord_plates: [
          {
            plateIssueDate: new Date(new Date().getTime()).toISOString(),
            plateSerialNumber: '123456',
            plateIssuer: 'issuer',
            plateReasonForIssue: 'Replacement'
          },
          {
            plateIssueDate: new Date(new Date().getTime() + 5).toISOString(),
            plateSerialNumber: '234567',
            plateIssuer: 'issuer',
            plateReasonForIssue: 'Replacement'
          },
          {
            plateIssueDate: new Date(new Date().getTime() - 5).toISOString(),
            plateSerialNumber: '345678',
            plateIssuer: 'issuer',
            plateReasonForIssue: 'Replacement'
          }
        ]
      } as TechRecordType<'trl'>;

      const plateFetched = component.mostRecentPlate;

      expect(plateFetched).toBeDefined();
      expect(plateFetched!.plateSerialNumber).toEqual('234567');
    });

    it('should return null if plates are empty', () => {
      component.techRecord = {} as TechRecordType<'trl'>;

      const plateFetched = component.mostRecentPlate;

      expect(plateFetched).toBeUndefined();
    });
  });

  describe('hasPlates', () => {
    it('should return false if plates is undefined', () => {
      component.techRecord = {} as TechRecordType<'trl'>;

      expect(component.hasPlates).toBeFalsy();
    });

    it('should return false if plates is empty', () => {
      component.techRecord = {} as TechRecordType<'trl'>;

      expect(component.hasPlates).toBeFalsy();
    });

    it('should return true if plates is not empty', () => {
      component.techRecord = {
        techRecord_plates: [
          {
            plateIssueDate: new Date().toISOString(),
            plateSerialNumber: '123456',
            plateIssuer: 'issuer',
            plateReasonForIssue: 'Replacement'
          }
        ]
      } as TechRecordType<'trl'>;

      expect(component.hasPlates).toBeTruthy();
    });
  });
});
