import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdrTankDetailsSubsequentInspectionsComponent } from './adr-tank-details-subsequent-inspections.component';

describe('AdrTankDetailsSubsequentInspectionsComponent', () => {
  let component: AdrTankDetailsSubsequentInspectionsComponent;
  let fixture: ComponentFixture<AdrTankDetailsSubsequentInspectionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdrTankDetailsSubsequentInspectionsComponent],
    })
      .compileComponents();

    fixture = TestBed.createComponent(AdrTankDetailsSubsequentInspectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
