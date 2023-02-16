import { APP_BASE_HREF } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MsalBroadcastService } from '@azure/msal-angular';
import { DynamicFormsModule } from '@forms/dynamic-forms.module';
import { createMockPsv } from '@mocks/psv-record.mock';
import { Roles } from '@models/roles.enum';
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
    component.vehicleTechRecord = createMockPsv(12345).techRecord[0];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
