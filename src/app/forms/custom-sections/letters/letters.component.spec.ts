import { APP_BASE_HREF } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { DynamicFormsModule } from '@forms/dynamic-forms.module';
import { createMockTrl } from '@mocks/trl-record.mock';
import { Roles } from '@models/roles.enum';
import { approvalType, LettersIntoAuthApprovalType, LettersOfAuth, VehicleTechRecordModel } from '@models/vehicle-tech-record.model';
import { StoreModule } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { UserService } from '@services/user-service/user-service';
import { SharedModule } from '@shared/shared.module';
import { initialAppState, State } from '@store/index';
import { of } from 'rxjs';
import { LettersComponent } from './letters.component';

describe('LettersComponent', () => {
  let component: LettersComponent;
  let fixture: ComponentFixture<LettersComponent>;
  let expectedVehicle = {} as VehicleTechRecordModel;
  let route: ActivatedRoute;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicFormsModule, SharedModule, StoreModule.forRoot({}), HttpClientTestingModule, RouterModule.forRoot([]), RouterTestingModule],
      declarations: [LettersComponent],
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
    fixture = TestBed.createComponent(LettersComponent);
    component = fixture.componentInstance;
    component.techRecord = {
      ...createMockTrl(12345).techRecord[0],
      letterOfAuth: {} as LettersOfAuth
    };
    component.vehicle = expectedVehicle;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('eligibleForLetter', () => {
    it('should return true if the approval type is valid', () => {
      component.techRecord.approvalType = approvalType.EU_WVTA_23_ON;
      expect(component.eligibleForLetter).toBeTruthy();
    });

    it('should return false if the approval type is valid', () => {
      component.techRecord.approvalType = approvalType.NTA;
      expect(component.eligibleForLetter).toBeFalsy();
    });
  });

  describe('letter', () => {
    it('should return the letter if it exists', () => {
      component.techRecord.letterOfAuth = { paragraphId: 3, letterIssuer: 'issuer' } as LettersOfAuth;

      expect(component.letter).toBeTruthy();
      expect(component.letter!.paragraphId).toEqual(3);
      expect(component.letter!.letterIssuer).toEqual('issuer');
    });

    it('should return undefined if it does not exist', () => {
      component.techRecord.letterOfAuth = undefined;

      expect(component.letter).toBe(undefined);
    });
  });
});
