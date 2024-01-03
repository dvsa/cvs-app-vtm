import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdrTankStatementUnNumberViewComponent } from './adr-tank-statement-un-number-view.component';

describe('AdrTankStatementUnNumberViewComponent', () => {
  let component: AdrTankStatementUnNumberViewComponent;
  let fixture: ComponentFixture<AdrTankStatementUnNumberViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdrTankStatementUnNumberViewComponent],
    })
      .compileComponents();

    fixture = TestBed.createComponent(AdrTankStatementUnNumberViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
