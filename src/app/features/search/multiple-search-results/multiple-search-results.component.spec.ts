import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { RoleRequiredDirective } from '@directives/app-role-required.directive';
import { DynamicFormsModule } from '@forms/dynamic-forms.module';
import { mockVehicleTechnicalRecordList } from '@mocks/mock-vehicle-technical-record.mock';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TechnicalRecordHttpService } from '@services/technical-record-http/technical-record-http.service';
import { UserService } from '@services/user-service/user-service';
import { initialAppState, State } from '@store/.';
import { selectQueryParams } from '@store/router/selectors/router.selectors';
import { techRecord } from '@store/technical-records';
import { firstValueFrom, of, ReplaySubject } from 'rxjs';
import { SingleSearchResultComponent } from '../single-search-result/single-search-result.component';
import { MultipleSearchResultsComponent } from './multiple-search-results.component';

describe('MultipleSearchResultsComponent', () => {
  let component: MultipleSearchResultsComponent;
  let fixture: ComponentFixture<MultipleSearchResultsComponent>;
  let store: MockStore<State>;
  let actions$ = new ReplaySubject<Action>();
  let techRecordHttpService: TechnicalRecordHttpService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SingleSearchResultComponent, MultipleSearchResultsComponent, RoleRequiredDirective],
      imports: [DynamicFormsModule, HttpClientTestingModule, RouterTestingModule],
      providers: [
        provideMockStore({ initialState: initialAppState }),
        provideMockActions(() => actions$),
        {
          provide: UserService,
          useValue: {
            roles$: of(['TechRecord.View'])
          }
        },
        TechnicalRecordHttpService
      ]
    }).compileComponents();
  });

  describe('default tests', () => {
    beforeEach(() => {
      store = TestBed.inject(MockStore);
      techRecordHttpService = TestBed.inject(TechnicalRecordHttpService);
      store.overrideSelector(selectQueryParams, { vin: '123456' });

      fixture = TestBed.createComponent(MultipleSearchResultsComponent);
      component = fixture.componentInstance;

      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should navigate back', fakeAsync(() => {
      const navigateBackSpy = jest.spyOn(component, 'navigateBack');

      const button = fixture.debugElement.query(By.css('.govuk-back-link'));
      expect(button).toBeTruthy();
      (button.nativeElement as HTMLButtonElement).click();

      tick();

      expect(navigateBackSpy).toHaveBeenCalled();
    }));
  });

  describe('searching', () => {
    beforeEach(() => {
      store = TestBed.inject(MockStore);
    });

    it('should search using a vin', async () => {
      store.overrideSelector(selectQueryParams, { vin: '123456' });

      fixture = TestBed.createComponent(MultipleSearchResultsComponent);
      component = fixture.componentInstance;
      const searchResult = await firstValueFrom(component.searchResults$);

      expect(searchResult).toBeDefined();
    });

    it('should search using a partial vin', async () => {
      store.overrideSelector(selectQueryParams, { partialVin: '123456' });

      fixture = TestBed.createComponent(MultipleSearchResultsComponent);
      component = fixture.componentInstance;
      const searchResult = await firstValueFrom(component.searchResults$);

      expect(searchResult).toBeDefined();
    });

    it('should search using a vrm', async () => {
      store.overrideSelector(selectQueryParams, { vrm: '123456' });

      fixture = TestBed.createComponent(MultipleSearchResultsComponent);
      component = fixture.componentInstance;
      const searchResult = await firstValueFrom(component.searchResults$);

      expect(searchResult).toBeDefined();
    });

    it('should search using a trailer id', async () => {
      store.overrideSelector(selectQueryParams, { trailerId: '123456' });

      fixture = TestBed.createComponent(MultipleSearchResultsComponent);
      component = fixture.componentInstance;
      const searchResult = await firstValueFrom(component.searchResults$);

      expect(searchResult).toBeDefined();
    });
  });
});
