import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { RoleRequiredDirective } from '@directives/app-role-required.directive';
import { Roles } from '@models/roles.enum';
import { provideMockStore } from '@ngrx/store/testing';
import { ReferenceDataService } from '@services/reference-data/reference-data.service';
import { UserService } from '@services/user-service/user-service';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { initialAppState } from '@store/.';
import { Observable, of } from 'rxjs';
import { Store } from '@ngrx/store';
import { ReferenceDataDeletedListComponent } from './reference-data-deleted-list.component';
import SpyInstance = jest.SpyInstance;

describe('DataTypeListComponent', () => {
  let component: ReferenceDataDeletedListComponent;
  let fixture: ComponentFixture<ReferenceDataDeletedListComponent>;
  let store: Store;
  let referenceDataService: ReferenceDataService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReferenceDataDeletedListComponent, RoleRequiredDirective, PaginationComponent],
      imports: [RouterTestingModule, HttpClientTestingModule, HttpClientModule],
      providers: [provideMockStore({ initialState: initialAppState }), ReferenceDataService, {
        provide: UserService,
        useValue: {
          roles$: of([Roles.ReferenceDataView]),
        },
      }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferenceDataDeletedListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    store = TestBed.inject(Store);
    referenceDataService = TestBed.inject(ReferenceDataService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should fetch the reference data and dispatch relevent action', () => {
      const storeSpy = jest.spyOn(store, 'dispatch');
      const serviceSpy = jest.spyOn(referenceDataService, 'loadReferenceDataByKey');
      component.ngOnInit();
      expect(serviceSpy).toHaveBeenCalled();
      expect(storeSpy).toHaveBeenCalled();
    });
  });

  describe('handlePaginationChange', () => {
    it('should update the component start and end values and call detectChanges', () => {
      component.handlePaginationChange({ start: 10, end: 10 });
      expect(component.pageStart).toBe(10);
      expect(component.pageEnd).toBe(10);
    });
  });

  describe('getters', () => {
    let observable: Observable<never[]>;
    let storeSpy: SpyInstance;
    beforeEach(() => {
      observable = of([]);
      storeSpy = jest.spyOn(store, 'pipe').mockReturnValue(observable);
    });
    describe('data$', () => {
      // This test was added purely for code coverage
      it('should call store pipe', () => {
        expect(component.data$).toBe(observable);
        expect(storeSpy).toHaveBeenCalled();
      });
    });
    describe('numberOfRecords$', () => {
      // This test was added purely for code coverage
      it('should call store pipe', () => {
        const dataSpy = jest.spyOn(component.data$, 'pipe').mockReturnValue(observable);
        expect(component.numberOfRecords$).toBe(observable);
        expect(dataSpy).toHaveBeenCalled();
        expect(storeSpy).toHaveBeenCalled();
      });
    });
    describe('paginatedItems$', () => {
      // This test was added purely for code coverage
      it('should call store pipe', () => {
        const dataSpy = jest.spyOn(component.data$, 'pipe').mockReturnValue(observable);
        expect(component.paginatedItems$).toBe(observable);
        expect(dataSpy).toHaveBeenCalled();
        expect(storeSpy).toHaveBeenCalled();
      });
    });
    describe('refDataAdminType$', () => {
      it('should call store pipe', () => {
        expect(component.refDataAdminType$).toBe(observable);
        expect(storeSpy).toHaveBeenCalled();
      });
    });
  });
});
