import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NumberPlateComponent } from './number-plate.component';

describe('NumberPlateComponent', () => {
  let component: NumberPlateComponent;
  let fixture: ComponentFixture<NumberPlateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NumberPlateComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NumberPlateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should format a standard vrm', () => {
    component.vrm = 'AA21AAA';
    expect(component.vrm).toEqual('AA21 AAA');
  });

  it('should not format a short vrm', () => {
    component.vrm = 'A123';
    expect(component.vrm).toEqual('A123');
  });
});
