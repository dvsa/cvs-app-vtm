import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AccordionComponent } from './accordion.component';

@Component({
  selector: 'app-host',
  template: `<app-accordion id="test" title="Test"> <div id="content">Details</div> </app-accordion>`
})
class HostComponent {}

describe('AccordionComponent', () => {
  let component: AccordionComponent;
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccordionComponent, HostComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HostComponent);
    component = fixture.debugElement.query(By.directive(AccordionComponent)).componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render dynamic content', () => {
    const content: HTMLDivElement = fixture.debugElement.query(By.css('#content')).nativeElement;
    expect(content.innerHTML).toBe('Details');
  });

  it('should toggle expanded value', () => {
    const button: HTMLButtonElement = fixture.debugElement.query(By.css('#accordion-control-test')).nativeElement;

    button.click();
    expect(component.expanded).toBeTruthy();

    button.click();
    expect(component.expanded).toBeFalsy();
  });

  it('should set expanded value to true', () => {
    const markForCheckSpy = jest.spyOn(component['cdr'], 'markForCheck');
    component.open();
    expect(component.expanded).toBeTruthy();
    expect(markForCheckSpy).toHaveBeenCalledTimes(1);
  });

  it('should set expanded value to false', () => {
    const markForCheckSpy = jest.spyOn(component['cdr'], 'markForCheck');
    component.expanded = true;
    component.close();
    expect(component.expanded).toBeFalsy();
    expect(markForCheckSpy).toHaveBeenCalledTimes(1);
  });
});
