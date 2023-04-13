import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { initialAppState, State } from '@store/.';
import { ReferenceDataComponent } from './reference-data.component';

describe('ReferenceDataComponent', () => {
  let component: ReferenceDataComponent;
  let fixture: ComponentFixture<ReferenceDataComponent>;
  let store: MockStore<State>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReferenceDataComponent],
      imports: [RouterTestingModule],
      providers: [provideMockStore({ initialState: initialAppState })]
    }).compileComponents();
  });

  beforeEach(() => {
    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(ReferenceDataComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
