import { AdditionalNotes } from './../../../models/adr-details';
import { CUSTOM_ELEMENTS_SCHEMA, Component, Input } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedModule } from '@app/shared';
import { TESTING_UTILS } from '@app/utils/testing.utils';
import { AdrDetails } from '@app/models/adr-details';
import { CertificateComponent } from './certificate.component';

const adrWithCertRequested = TESTING_UTILS.mockAdrDetails({
  additionalNotes: {
    guidanceNotes: ['New certificate requested']
  } as AdditionalNotes
}) as AdrDetails;

describe('CertificateComponent', () => {
  let component: TestCertificateComponent;
  let fixture: ComponentFixture<TestCertificateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [
        CertificateComponent,
        TestCertificateComponent,
        TestCertificateEditComponent
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestCertificateComponent);
    component = fixture.componentInstance;
    component.edit = false;
    component.adrDetails = TESTING_UTILS.mockAdrDetails();
  });

  it('should create view only with populated data', () => {
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });

  it('should render the editable component if edit is true', () => {
    component.adrDetails = adrWithCertRequested;
    component.edit = true;
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });
});

@Component({
  selector: 'test-vtm-certificate',
  template: `
    <vtm-certificate [edit]="edit" [adrDetails]="adrDetails"></vtm-certificate>
  `
})
class TestCertificateComponent {
  edit: boolean;
  adrDetails: AdrDetails;
}

@Component({
  selector: 'vtm-certificate-edit',
  template: `
    <div>Value of Certificate Request is {{ hasCertificateRequested }}</div>
  `
})
class TestCertificateEditComponent {
  @Input() hasCertificateRequested: boolean;
}
