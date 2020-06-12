import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitEditComponent } from './visit-edit.component';
import { FormGroupDirective, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TestStation } from '@app/models/test-station';
import { TESTING_UTILS } from '@app/utils/testing.utils';
import { TEST_STATION_TYPE } from '@app/test-record/test-record.enums';
import { Component, Input } from '@angular/core';
import { TEST_MODEL_UTILS } from '@app/utils/test-model.utils';

describe('VisitEditComponent', () => {
  let component: VisitEditComponent;
  let fixture: ComponentFixture<VisitEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VisitEditComponent, TestAutocompleteComponent],
      imports: [FormsModule, ReactiveFormsModule],
      providers: [
        FormGroupDirective,
        {
          provide: FormGroupDirective,
          useValue: TESTING_UTILS.mockFormGroupDirective()
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitEditComponent);
    component = fixture.componentInstance;
    component.testRecord = TEST_MODEL_UTILS.mockTestRecord();
    component.testStations = [
      {
        testStationEmails: ['test'],
        testStationPNumber: '1',
        testStationType: 'atf'
      } as TestStation
    ];
    component.testStationsOptions = ['test'];
    component.testStationType = 'test';
    component.testStationName = 'test';
    component.testStationPNumber = '(123)';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(fixture).toMatchSnapshot();
  });

  it('should search test station type', () => {
    const testStationType = component.searchTestStationType('1');
    expect(testStationType).toEqual(TEST_STATION_TYPE.ATF);
  });
});

@Component({
  selector: 'vtm-autocomplete',
  template: `
    <div>{{ autocompleteData }}</div>
  `
})
class TestAutocompleteComponent {
  @Input() autocompleteData;
  @Input('aria-describedby') ariaDescribedBy: string | null;
  @Input('value') _value = '';
  @Input() hasError: boolean;
}
