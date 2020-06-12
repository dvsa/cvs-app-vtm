import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SeatbeltInstallationCheckComponent } from './seatbelt-installation-check.component';
import { SharedModule } from '@app/shared/shared.module';
import { TestType } from '@app/models/test.type';
import { VIEW_STATE } from '@app/app.enums';
import { Component, Input } from '@angular/core';
import { TEST_MODEL_UTILS } from '@app/utils/test-model.utils';

describe('SeatbeltInstallationCheckComponent', () => {
  let component: SeatbeltInstallationCheckComponent;
  let fixture: ComponentFixture<SeatbeltInstallationCheckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [SeatbeltInstallationCheckComponent, TestSeatbeltInstallationCheckComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeatbeltInstallationCheckComponent);
    component = fixture.componentInstance;
    component.testType = TEST_MODEL_UTILS.mockTestType();
    component.editState = VIEW_STATE.VIEW_ONLY;
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
  selector: 'vtm-seatbelt-installation-check-edit',
  template: `
    <div>{{ testType | json }}</div>
  `
})
class TestSeatbeltInstallationCheckComponent {
  @Input() testType: TestType;
  @Input() isSubmitted: boolean;
}
