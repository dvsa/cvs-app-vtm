import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaserComponent } from './purchaser.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { TESTING_UTILS } from '@app/utils/testing.utils';
import { PurchaserDetails } from '@app/models/tech-record.model';

describe('PurchaserComponent', () => {
  let component: PurchaserComponent;
  let fixture: ComponentFixture<PurchaserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [PurchaserComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaserComponent);
    component = fixture.componentInstance;
    component.purchaser = TESTING_UTILS.mockPurchaser();
  });

  it('should create view only with populated data', () => {
    fixture.detectChanges();

    expect(component).toBeDefined();
    expect(fixture).toMatchSnapshot();
  });

  it('should have the address1And2 correctly populated', () => {
    component.purchaser = TESTING_UTILS.mockPurchaser({
      address1: 'someone',
      address2: 'somewhere'
    });
    fixture.detectChanges();
    expect(component.address1And2).toEqual('someone somewhere');
  });
});
