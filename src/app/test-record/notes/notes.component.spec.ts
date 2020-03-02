import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotesComponent } from './notes.component';
import {SharedModule} from '@app/shared/shared.module';
import {TechRecordHelpersService} from '@app/technical-record/tech-record-helpers.service';
import {TestType} from '@app/models/test.type';
import {TestResultModel} from '@app/models/test-result.model';

describe('NotesComponent', () => {
  let component: NotesComponent;
  let fixture: ComponentFixture<NotesComponent>;
  const testType = {} as TestType;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ SharedModule ],
      providers: [
        TechRecordHelpersService
      ],
      declarations: [ NotesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotesComponent);
    component = fixture.componentInstance;
    component.testType = testType;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
