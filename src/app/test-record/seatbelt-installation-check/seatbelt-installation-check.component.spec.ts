import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SeatbeltInstallationCheckComponent } from './seatbelt-installation-check.component';
import { SharedModule } from '@app/shared/shared.module';
import { TestType } from '@app/models/test.type';
import { VIEW_STATE } from '@app/app.enums';
import { Component, Input } from '@angular/core';
import { TESTING_TEST_MODELS_UTILS } from '@app/utils/testing-test-models.utils';

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
    component.testType = TESTING_TEST_MODELS_UTILS.mockTestType();
    component.editState = VIEW_STATE.VIEW_ONLY;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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
