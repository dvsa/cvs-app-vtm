import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NotesComponent } from './notes.component';
import { SharedModule } from '@app/shared/shared.module';
import { TestType } from '@app/models/test.type';
import { Component, Input } from '@angular/core';
import { VIEW_STATE } from '@app/app.enums';
import { TESTING_TEST_MODELS_UTILS } from '@app/utils/testing-test-models.utils';

describe('NotesComponent', () => {
  let component: NotesComponent;
  let fixture: ComponentFixture<NotesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [NotesComponent, TestNotesEditComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotesComponent);
    component = fixture.componentInstance;
    component.testType = TESTING_TEST_MODELS_UTILS.mockTestType();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(fixture).toMatchSnapshot();
  });
});

@Component({
  selector: 'vtm-notes-edit',
  template: `
    <div>{{ testType | json }}</div>
  `
})
class TestNotesEditComponent {
  @Input() currentState: VIEW_STATE;
  @Input() testType: TestType;
  @Input() isSubmitted: boolean;
}
