import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { initialAppState, State } from '@store/.';
import { ReferenceDataSelectTypeComponent } from './reference-data-select-type.component';
import { ReferenceDataService } from '@services/reference-data/reference-data.service';
import { UserService } from '@services/user-service/user-service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ReferenceDataComponent', () => {
  let component: ReferenceDataSelectTypeComponent;
  let fixture: ComponentFixture<ReferenceDataSelectTypeComponent>;
  let store: MockStore<State>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReferenceDataSelectTypeComponent],
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [provideMockStore({ initialState: initialAppState }), ReferenceDataService, { provide: UserService, useValue: {} }]
    }).compileComponents();
  });

  beforeEach(() => {
    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(ReferenceDataSelectTypeComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
