import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitComponent } from './visit.component';
import { SharedModule } from '@app/shared/shared.module';
import { TestResultModel } from '@app/models/test-result.model';
import { Component, Input } from '@angular/core';
import { VIEW_STATE } from '@app/app.enums';
import { TestStation } from '@app/models/test-station';
import { TEST_MODEL_UTILS } from '@app/utils/test-model.utils';

describe('VisitComponent', () => {
  let component: VisitComponent;
  let fixture: ComponentFixture<VisitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [VisitComponent, TestVisitEditComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitComponent);
    component = fixture.componentInstance;
    component.testRecord = TEST_MODEL_UTILS.mockTestRecord();
    component.editState = VIEW_STATE.VIEW_ONLY;
    component.testStations = [{ testStationId: '123', testStationPNumber: '11' } as TestStation];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(fixture).toMatchSnapshot();
  });

  it('should render view template if editState is VIEW_ONLY', () => {
    component.editState = VIEW_STATE.VIEW_ONLY;
    expect(fixture).toMatchSnapshot();
  });

  it('should render edit template if editState is EDIT', () => {
    component.editState = VIEW_STATE.EDIT;
    expect(fixture).toMatchSnapshot();
  });
});

@Component({
  selector: 'vtm-visit-edit',
  template: `
    <div>{{ testRecord | json }}</div>
  `
})
class TestVisitEditComponent {
  @Input() testRecord: TestResultModel;
  @Input() testStations: TestStation[];
  @Input() isSubmitted: boolean;
}
