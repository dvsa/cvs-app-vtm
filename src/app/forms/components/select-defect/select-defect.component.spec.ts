import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectDefectComponent } from './select-defect.component';

describe('SelectDefectComponent', () => {
  let component: SelectDefectComponent;
  let fixture: ComponentFixture<SelectDefectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectDefectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectDefectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
