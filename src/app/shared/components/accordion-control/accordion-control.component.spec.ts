import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AccordionComponent } from '../accordion/accordion.component';
import { AccordionControlComponent } from './accordion-control.component';

@Component({
  selector: 'app-host',
  template: `<app-accordion-control>
    <app-accordion id="test" title="Test"> <div id="content">Details</div> </app-accordion>
  </app-accordion-control>`
})
class HostComponent {}

describe('AccordionControlComponent', () => {
  let component: AccordionControlComponent;
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccordionControlComponent, HostComponent, AccordionComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HostComponent);
    component = fixture.debugElement.query(By.directive(AccordionControlComponent)).componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open and close child accordions', () => {
    fixture.whenRenderingDone().then(() => {
      expect(component.accordions?.length).toBe(1);
      expect(component.accordions[0].expanded).toBeFalsy();
      component.open();
      expect(component.accordions[0].expanded).toBeTruthy();
      component.close();
      expect(component.accordions[0].expanded).toBeFalsy();
    });
  });
});
