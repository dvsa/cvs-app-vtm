import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';

import { PurchaserComponent } from './purchaser.component';
import { SharedModule } from '@app/shared/shared.module';
import { TESTING_UTILS } from '@app/utils/testing.utils';
import { TechRecord } from '@app/models/tech-record.model';

describe('PurchaserComponent', () => {
  let fixture: ComponentFixture<TestPurchaserComponent>;
  let component: TestPurchaserComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [PurchaserComponent, TestPurchaserComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestPurchaserComponent);
    component = fixture.componentInstance;
    component.activeRecord = {
      purchaserDetails: TESTING_UTILS.mockPurchaser()
    } as TechRecord;
  });

  it('should create view only with populated data', () => {
    fixture.detectChanges();

    expect(component).toBeDefined();
    expect(fixture).toMatchSnapshot();
  });
});

@Component({
  selector: 'test-vtm-purchaser',
  template: `
    <vtm-purchaser [techRecord]="activeRecord" [editState]="editState"> </vtm-purchaser>
  `
})
class TestPurchaserComponent {
  activeRecord: TechRecord;
  editState: boolean;
}
