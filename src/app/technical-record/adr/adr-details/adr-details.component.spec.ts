import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedModule } from '@app/shared';
import { AdrDetails } from '@app/models/adr-details';
import { TESTING_UTILS } from '@app/utils/testing.utils';
import { AdrDetailsComponent } from './adr-details.component';
import { MetaData } from '@app/models/meta-data';

describe('AdrDetailsComponent', () => {
  let component: AdrDetailsComponent;
  let fixture: ComponentFixture<AdrDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [AdrDetailsComponent, TestAdrDetailsEditComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdrDetailsComponent);
    component = fixture.componentInstance;
  });

  it('should create view only with populated data', () => {
    component.edit = false;
    component.adrDetails = TESTING_UTILS.mockAdrDetails();
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should render the editable component if edit is true', () => {
    component.edit = true;
    component.adrDetails = { vehicleDetails: { type: 'Centre axle battery' } } as AdrDetails;
    component.metaData = {
      adrDetails: {
        memosApplyFe: ['07/09 3mth leak ext']
      }
    } as MetaData;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });
});

@Component({
  selector: 'vtm-adr-details-edit',
  template: `
    <div>{{ adrDetails | json }}</div>
    <div>{{ metaData | json }}</div>
  `
})
class TestAdrDetailsEditComponent {
  @Input() adrDetails: AdrDetails;
  @Input() metaData: MetaData;
}
