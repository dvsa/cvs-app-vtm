import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { RoleRequiredDirective } from '@directives/app-role-required.directive';
import { DynamicFormsModule } from '@forms/dynamic-forms.module';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TechnicalRecordHttpService } from '@services/technical-record-http/technical-record-http.service';
import { UserService } from '@services/user-service/user-service';
import { initialAppState, State } from '@store/.';
import { selectQueryParams } from '@store/router/selectors/router.selectors';
import { firstValueFrom, of, ReplaySubject } from 'rxjs';
import { SingleSearchResultComponent } from '../single-search-result/single-search-result.component';
import { MultipleSearchResultsComponent } from './multiple-search-results.component';
import { BehaviorSubject } from 'rxjs';
import { TechRecordSearchSchema } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/search';

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
            roles$: of(['TechRecord.View', 'TechRecord.Create'])
          }
        },
        TechnicalRecordHttpService
      ]
    }).compileComponents();
  });

  describe('default tests when searchResults not null', () => {
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
      const newData: TechRecordSearchSchema[] = [
        {
          vin: '1B7GG36N12S678410',
          techRecord_statusCode: 'provisional',
          techRecord_vehicleType: 'psv',
          createdTimestamp: '2023-09-27T12:00:00Z',
          systemNumber: '12345',
          techRecord_manufactureYear: 2013
        }
      ];
      component.searchResults$ = new BehaviorSubject<TechRecordSearchSchema[] | undefined>(newData);
      fixture.detectChanges();

      const button = fixture.debugElement.query(By.css('.govuk-back-link'));
      expect(button).toBeTruthy();
      (button.nativeElement as HTMLButtonElement).click();

      tick();

      expect(navigateBackSpy).toHaveBeenCalled();
    }));
  });

  describe('when searchResults is null', () => {
    beforeEach(() => {
      store = TestBed.inject(MockStore);
      techRecordHttpService = TestBed.inject(TechnicalRecordHttpService);
      store.overrideSelector(selectQueryParams, { vin: '123456' });

      fixture = TestBed.createComponent(MultipleSearchResultsComponent);
      component = fixture.componentInstance;

      fixture.detectChanges();
    });

    it('should return not found error and create link', async () => {
      const button = fixture.debugElement.query(By.css('.govuk-link'));
      expect(button).toBeTruthy();
    });
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
