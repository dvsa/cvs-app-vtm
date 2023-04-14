import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { initialAppState, State } from '@store/.';
import { DataTypeListComponent } from './data-type-list.component';

describe('DataTypeListComponent', () => {
  let component: DataTypeListComponent;
  let fixture: ComponentFixture<DataTypeListComponent>;
  let store: MockStore<State>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DataTypeListComponent],
      imports: [RouterTestingModule],
      providers: [provideMockStore({ initialState: initialAppState })]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataTypeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
