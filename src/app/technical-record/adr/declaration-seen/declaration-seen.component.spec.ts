import { CUSTOM_ELEMENTS_SCHEMA, Component, Input } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedModule } from '@app/shared';
import { TESTING_UTILS } from '@app/utils/testing.utils';
import { AdrDetails } from '@app/models/adr-details';
import { DeclarationSeenComponent } from './declaration-seen.component';

describe('DeclarationSeenComponent', () => {
  let component: TestDeclarationSeenComponent;
  let fixture: ComponentFixture<TestDeclarationSeenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [
        DeclarationSeenComponent,
        TestDeclarationSeenComponent,
        TestDeclarationSeenEditComponent
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestDeclarationSeenComponent);
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
  selector: 'test-vtm-declaration-seen',
  template: `
    <vtm-declaration-seen [edit]="edit" [adrDetails]="adrDetails"></vtm-declaration-seen>
  `
})
class TestDeclarationSeenComponent {
  edit: boolean;
  adrDetails: AdrDetails;
}

@Component({
  selector: 'vtm-declaration-seen-edit',
  template: `
    <div>adrDetails: {{ adrDetails | json }}</div>
  `
})
class TestDeclarationSeenEditComponent {
  @Input() adrDetails: AdrDetails;
}
