import { APP_BASE_HREF } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { DynamicFormsModule } from '@forms/dynamic-forms.module';
import { Roles } from '@models/roles.enum';
import { StoreModule } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { UserService } from '@services/user-service/user-service';
import { SharedModule } from '@shared/shared.module';
import { State, initialAppState } from '@store/index';
import { of } from 'rxjs';
import { ApprovalType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/approvalType.enum.js';
import { LettersComponent } from './letters.component';

describe('LettersComponent', () => {
  let component: LettersComponent;
  let fixture: ComponentFixture<LettersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicFormsModule, SharedModule, StoreModule.forRoot({}), HttpClientTestingModule, RouterModule.forRoot([]), RouterTestingModule],
      declarations: [LettersComponent],
      providers: [
        provideMockStore<State>({ initialState: initialAppState }),
        {
          provide: UserService,
          useValue: {
            roles$: of([Roles.TechRecordAmend]),
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            useValue: { params: of([{ id: 1 }]) },
          },
        },
        {
          provide: APP_BASE_HREF,
          useValue: '/',
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LettersComponent);
    component = fixture.componentInstance;
    component.techRecord = {
      systemNumber: 'foo',
      createdTimestamp: 'bar',
      vin: 'testVin',
      techRecord_statusCode: 'current',
    } as TechRecordType<'trl'>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('eligibleForLetter', () => {
    it('should return true if the approval type is valid', () => {
      (component.techRecord as TechRecordType<'trl'>).techRecord_approvalType = ApprovalType.EU_WVTA_23_ON;
      expect(component.eligibleForLetter).toBeTruthy();
    });

    it('should return false if the approval type is valid', () => {
      (component.techRecord as TechRecordType<'trl'>).techRecord_approvalType = ApprovalType.NTA;
      expect(component.eligibleForLetter).toBeFalsy();
    });
  });

  describe('letter', () => {
    it('should return the letter if it exists', () => {
      (component.techRecord as TechRecordType<'trl'>).techRecord_letterOfAuth_letterType = 'trailer acceptance';
      (component.techRecord as TechRecordType<'trl'>).techRecord_letterOfAuth_paragraphId = 3;
      (component.techRecord as TechRecordType<'trl'>).techRecord_letterOfAuth_letterIssuer = 'issuer';
      expect(component.letter).toBeTruthy();
      expect(component.letter?.paragraphId).toBe(3);
      expect(component.letter?.letterIssuer).toBe('issuer');
    });

    it('should return undefined if it does not exist', () => {
      (component.techRecord as TechRecordType<'trl'>).techRecord_letterOfAuth_letterType = undefined;

      expect(component.letter).toBeUndefined();
    });
  });
});
