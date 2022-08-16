import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefectSelectComponent } from './defect-select.component';

describe('DefectSelectComponent', () => {
  let component: DefectSelectComponent;
  let fixture: ComponentFixture<DefectSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DefectSelectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DefectSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
