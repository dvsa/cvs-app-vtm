import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { DynamicFormsModule } from '@forms/dynamic-forms.module';
import { mockVehicleTechnicalRecord } from '@mocks/mock-vehicle-technical-record.mock';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { initialAppState } from '@store/.';
import { SingleSearchResultComponent } from './single-search-result.component';
import { RoleRequiredDirective } from '@directives/app-role-required.directive';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { UserService } from '@services/user-service/user-service';
import { ReplaySubject, of } from 'rxjs';

describe('SingleSearchResultComponent', () => {
  let component: SingleSearchResultComponent;
  let fixture: ComponentFixture<SingleSearchResultComponent>;
  let router: Router;
  let store: MockStore;
  let actions$ = new ReplaySubject<Action>();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SingleSearchResultComponent, RoleRequiredDirective],
      imports: [DynamicFormsModule, HttpClientTestingModule, RouterTestingModule],
      providers: [
        provideMockStore({ initialState: initialAppState }),
        provideMockActions(() => actions$),
        {
          provide: UserService,
          useValue: {
            roles$: of(['TechRecord.View'])
          }
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    router = TestBed.inject(Router);
    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(SingleSearchResultComponent);
    component = fixture.componentInstance;
    component.vehicleTechRecord = mockVehicleTechnicalRecord();
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should handle vehicle with no tech records', () => {
    component.vehicleTechRecord.techRecord = [];
    fixture.detectChanges();
  });

  it('should handle vehicle with no vrms', () => {
    component.vehicleTechRecord.vrms = [];
    fixture.detectChanges();
  });
});
