import { CUSTOM_ELEMENTS_SCHEMA, Component, Input } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedModule } from '@app/shared';
import { TESTING_UTILS } from '@app/utils/testing.utils';
import { AdrDetails } from '@app/models/adr-details';
import { DeclarationSeenComponent } from './declaration-seen.component';

describe('DeclarationSeenComponent', () => {
  let component: DeclarationSeenComponent;
  let fixture: ComponentFixture<DeclarationSeenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [DeclarationSeenComponent, DeclarationSeenEditComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeclarationSeenComponent);
    component = fixture.componentInstance;
    component.edit = false;
    component.adrDetails = TESTING_UTILS.mockAdrDetails({ weight: '500' });
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
  selector: 'vtm-declaration-seen-edit',
  template: `
    <div>adrDetails: {{ adrDetails | json }}</div>
  `
})
class DeclarationSeenEditComponent {
  @Input() adrDetails: AdrDetails;
}
