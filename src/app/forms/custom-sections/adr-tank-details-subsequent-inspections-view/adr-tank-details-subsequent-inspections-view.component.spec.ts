import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdrTankDetailsSubsequentInspectionsViewComponent } from './adr-tank-details-subsequent-inspections-view.component';

describe('AdrTankDetailsSubsequentInspectionsViewComponent', () => {
  let component: AdrTankDetailsSubsequentInspectionsViewComponent;
  let fixture: ComponentFixture<AdrTankDetailsSubsequentInspectionsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdrTankDetailsSubsequentInspectionsViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdrTankDetailsSubsequentInspectionsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
