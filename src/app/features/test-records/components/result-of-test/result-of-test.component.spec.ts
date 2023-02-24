import { ChangeDetectorRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { resultOfTestEnum } from '@models/test-types/test-type.model';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TagComponent } from '@shared/components/tag/tag.component';
import { DefaultNullOrEmpty } from '@shared/pipes/default-null-or-empty/default-null-or-empty.pipe';
import { initialAppState, State } from '@store/.';
import { of } from 'rxjs';

import { ResultOfTestComponent } from './result-of-test.component';

describe('ResultOfTestComponent', () => {
  let component: ResultOfTestComponent;
  let fixture: ComponentFixture<ResultOfTestComponent>;
  let store: MockStore<State>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResultOfTestComponent, DefaultNullOrEmpty, TagComponent],
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
    component.resultOfTest = resultOfTestEnum.pass;
    await runOnPushChangeDetection(fixture);
    const tag = fixture.debugElement.query(By.css('.govuk-tag'));
    expect(tag.nativeElement.innerHTML).toBe('Pass');
    component.resultOfTest = resultOfTestEnum.fail;
    await runOnPushChangeDetection(fixture);
    expect(tag.nativeElement.innerHTML).toBe('Fail');
  });
});

export async function runOnPushChangeDetection(fixture: ComponentFixture<any>): Promise<void> {
  const changeDetectorRef = fixture.debugElement.injector.get<ChangeDetectorRef>(ChangeDetectorRef);
  changeDetectorRef.detectChanges();
  return fixture.whenStable();
}
