import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { initialAppState, State } from '@store/.';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { AddReferenceDataComponent } from './add-reference-data.component';

describe('AddReferenceDataComponent', () => {
  let component: AddReferenceDataComponent;
  let fixture: ComponentFixture<AddReferenceDataComponent>;
  let store: MockStore<State>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddReferenceDataComponent],
      imports: [RouterTestingModule],
      providers: [provideMockStore({ initialState: initialAppState })]
    }).compileComponents();
  });

  beforeEach(() => {
    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(AddReferenceDataComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
