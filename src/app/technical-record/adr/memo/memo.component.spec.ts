import { CUSTOM_ELEMENTS_SCHEMA, Component, Input } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedModule } from '@app/shared';
import { TESTING_UTILS } from '@app/utils/testing.utils';
import { AdrDetails } from '@app/models/adr-details';
import { MemoComponent } from './memo.component';

describe('MemoComponent', () => {
  let component: TestMemoComponent;
  let fixture: ComponentFixture<TestMemoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [MemoComponent, TestMemoComponent, TestMemoEditComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestMemoComponent);
    component = fixture.componentInstance;
    component.edit = false;
    component.adrDetails = TESTING_UTILS.mockAdrDetails({ memosApply: ['07/09 3mth leak ext'] });
  });

  it('should create view only with populated data', () => {
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });

  it('should render the editable component if edit is true', () => {
    component.edit = true;
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });
});

@Component({
  selector: 'test-vtm-memo',
  template: `
    <vtm-memo [edit]="edit" [adrDetails]="adrDetails"></vtm-memo>
  `
})
class TestMemoComponent {
  edit: boolean;
  adrDetails: AdrDetails;
}

@Component({
  selector: 'vtm-memo-edit',
  template: `
    <div>Value of Memos Applied is {{ hasMemosApplied }}</div>
  `
})
class TestMemoEditComponent {
  @Input() hasMemosApplied: boolean;
}
