import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { resultOfTestEnum } from '@models/test-types/test-type.model';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { DefaultNullOrEmpty } from '@shared/pipes/default-null-or-empty/default-null-or-empty.pipe';
import { initialAppState, State } from '@store/.';
import { of } from 'rxjs';
import { runOnPushChangeDetection } from 'src/test-utils/test-utils';

import { ResultOfTestComponent } from './result-of-test.component';

describe('ResultOfTestComponent', () => {
  let component: ResultOfTestComponent;
  let fixture: ComponentFixture<ResultOfTestComponent>;
  let store: MockStore<State>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResultOfTestComponent, DefaultNullOrEmpty],
      providers: [provideMockStore({ initialState: initialAppState })]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultOfTestComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render on the dom with the correct test result from the service', async () => {
    jest.spyOn(component, 'resultOfTest$', 'get').mockReturnValue(of(resultOfTestEnum.pass));
    await runOnPushChangeDetection(fixture);
    const value = fixture.debugElement.query(By.css('.govuk-summary-list__value'));
    expect(value.nativeElement.innerHTML).toBe('Pass');
    jest.spyOn(component, 'resultOfTest$', 'get').mockReturnValue(of(resultOfTestEnum.fail));
    await runOnPushChangeDetection(fixture);
    expect(value.nativeElement.innerHTML).toBe('Fail');
  });
});
