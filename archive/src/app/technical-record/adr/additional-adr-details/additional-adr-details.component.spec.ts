import { CUSTOM_ELEMENTS_SCHEMA, Component, Input } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedModule } from '@app/shared';
import { TESTING_UTILS } from '@app/utils/testing.utils';
import { AdditionalAdrDetailsComponent } from './additional-adr-details.component';
import { AdrDetails } from '@app/models/adr-details';

describe('AdditionalAdrDetailsComponent', () => {
  let component: AdditionalAdrDetailsComponent;
  let fixture: ComponentFixture<AdditionalAdrDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [AdditionalAdrDetailsComponent, TestAdditionalAdrDetailEditComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdditionalAdrDetailsComponent);
    component = fixture.componentInstance;
    component.adrDetails = {
      additionalExaminerNotes: 'some notes!!!',
      adrCertificateNotes: 'some certificate notes!'
    } as AdrDetails;
  });

  it('should create view only with populated data', () => {
    component.edit = false;
    fixture.detectChanges();

    expect(component).toBeDefined();
    expect(fixture).toMatchSnapshot();
  });

  it('should render the editable component if edit is true', () => {
    component.edit = true;
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });
});

@Component({
  selector: 'vtm-additional-adr-detail-edit',
  template: `
    <div>{{ adrDetails | json }}</div>
  `
})
class TestAdditionalAdrDetailEditComponent {
  @Input() adrDetails: AdrDetails;
}
