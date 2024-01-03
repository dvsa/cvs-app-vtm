import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdrTankDetailsInitialInspectionViewComponent } from './adr-tank-details-initial-inspection-view.component';

describe('AdrTankDetailsInitialInspectionViewComponent', () => {
  let component: AdrTankDetailsInitialInspectionViewComponent;
  let fixture: ComponentFixture<AdrTankDetailsInitialInspectionViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdrTankDetailsInitialInspectionViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdrTankDetailsInitialInspectionViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
