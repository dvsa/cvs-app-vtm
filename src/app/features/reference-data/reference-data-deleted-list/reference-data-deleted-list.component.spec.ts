import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ReferenceDataService } from '@services/reference-data/reference-data.service';
import { UserService } from '@services/user-service/user-service';
import { initialAppState, State } from '@store/.';
import { ReferenceDataDeletedListComponent } from './reference-data-deleted-listcomponent';

describe('DataTypeListComponent', () => {
  let component: ReferenceDataDeletedListComponent;
  let fixture: ComponentFixture<ReferenceDataDeletedListComponent>;
  let store: MockStore<State>;
  let router: Router;
  let route: ActivatedRoute;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReferenceDataDeletedListComponent],
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [provideMockStore({ initialState: initialAppState }), ReferenceDataService, { provide: UserService, useValue: {} }]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferenceDataDeletedListComponent);
    component = fixture.componentInstance;
    route = TestBed.inject(ActivatedRoute);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('back', () => {
    it('should navigate to reference-data', () => {
      const navigateSpy = jest.spyOn(router, 'navigate');

      component.back();

      expect(navigateSpy).toBeCalledWith(['reference-data']);
    });
  });
});
