import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NumberPlateComponent } from './number-plate.component';

describe('NumberPlateComponent', () => {
  let component: NumberPlateComponent;
  let fixture: ComponentFixture<NumberPlateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NumberPlateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NumberPlateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
