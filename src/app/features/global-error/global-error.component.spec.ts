import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalErrorComponent } from './global-error.component';
import { provideMockStore } from '@ngrx/store/testing';
import { initialGlobalErrorState } from '@store/global-error/reducers/global-error-service.reducer';

describe('GlobalErrorComponent', () => {
  let component: GlobalErrorComponent;
  let fixture: ComponentFixture<GlobalErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GlobalErrorComponent ],
      providers: [provideMockStore({ initialState: initialGlobalErrorState })]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobalErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
