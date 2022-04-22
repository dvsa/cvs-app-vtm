import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BaseControlComponent } from './base-control.component';

describe('BaseControlComponent', () => {
  let component: BaseControlComponent;
  let fixture: ComponentFixture<BaseControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BaseControlComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should register a change', () => {
    component.registerOnChange('FUNCTION');
    expect(component.onChange).toEqual('FUNCTION');
  });

  it('should register it has been touched', () => {
    component.registerOnTouched('FUNCTION');
    expect(component.onTouched).toEqual('FUNCTION');
  });

  describe('interacting with the value', () => {
    it('writeValue should set the value', () => {
      component.writeValue('anything');
      expect(component.value).toEqual('anything');
    });

    it('set should set the value', () => {
      component.value = 'anything';
      expect(component.value).toEqual('anything');
    });
  });
});
