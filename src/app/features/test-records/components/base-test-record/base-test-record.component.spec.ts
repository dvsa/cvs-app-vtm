import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { RouterService } from '@services/router/router.service';
import { initialAppState } from '@store/.';
import { BaseTestRecordComponent } from './base-test-record.component';

describe('BaseTestRecordComponent', () => {
  let component: BaseTestRecordComponent;
  let fixture: ComponentFixture<BaseTestRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BaseTestRecordComponent],
      providers: [RouterService, provideMockStore({ initialState: initialAppState })]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseTestRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
