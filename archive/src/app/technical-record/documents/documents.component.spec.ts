import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, Component, Input } from '@angular/core';

import { DocumentsComponent } from './documents.component';
import { TESTING_UTILS } from '@app/utils/testing.utils';
import { SharedModule } from '@app/shared/shared.module';
import { Microfilm } from '@app/models/tech-record.model';

describe('DocumentsComponent', () => {
  let component: DocumentsComponent;
  let fixture: ComponentFixture<DocumentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [DocumentsComponent, TestDocumentsEditComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentsComponent);
    component = fixture.componentInstance;
    component.microfilm = TESTING_UTILS.mockMicrofilm();
  });

  it('should create view only with populated data', () => {
    fixture.detectChanges();

    expect(component).toBeDefined();
    expect(fixture).toMatchSnapshot();
  });

  it('should create edit only view when editState is set to true', () => {
    component.editState = true;
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });
});

@Component({
  selector: 'vtm-documents-edit',
  template: `
    <div>microfilmDetails is: {{ microfilmDetails | json }}</div>
  `
})
class TestDocumentsEditComponent {
  @Input() microfilmDetails: Microfilm;
}
