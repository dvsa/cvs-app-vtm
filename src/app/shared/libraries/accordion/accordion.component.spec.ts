import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { AccordionComponent } from './accordion.component';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('AccordionComponent', () => {
  let component: AccordionComponent;
  let fixture: ComponentFixture<AccordionComponent>;

  let testComponent: TestAccordionComponent;
  let testFixture: ComponentFixture<TestAccordionComponent>;
  let element: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AccordionComponent, TestAccordionComponent]
    }).compileComponents();
  }));

  beforeEach(fakeAsync(() => {
    fixture = TestBed.createComponent(AccordionComponent);
    component = fixture.componentInstance;
    testFixture = TestBed.createComponent(TestAccordionComponent);
    testComponent = testFixture.componentInstance;
    testFixture.detectChanges();
    tick();
    element = testFixture.debugElement.query(By.css('[name=testAccordion]'));
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(fixture).toMatchSnapshot();
  });

  it('should populate the accordion with provided content', fakeAsync(() => {
    testFixture.detectChanges();
    tick();

    expect(element.nativeElement.innerHTML).toEqual('Test');
    expect(testFixture).toMatchSnapshot();
  }));
});

@Component({
  selector: 'test-accordion',
  template: `
    <p name="testAccordion">Test</p>
  `
})
class TestAccordionComponent {}
