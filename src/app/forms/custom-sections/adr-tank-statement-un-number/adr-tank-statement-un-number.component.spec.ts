import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdrTankStatementUnNumberComponent } from './adr-tank-statement-un-number.component';

describe('AdrTankStatementUnNumberComponent', () => {
  let component: AdrTankStatementUnNumberComponent;
  let fixture: ComponentFixture<AdrTankStatementUnNumberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdrTankStatementUnNumberComponent],
    })
      .compileComponents();

    fixture = TestBed.createComponent(AdrTankStatementUnNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
