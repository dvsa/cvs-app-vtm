import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { AccordionItemComponent } from './accordion-item.component';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('AccordionItemComponent', () => {
  let component: AccordionItemComponent;
  let fixture: ComponentFixture<AccordionItemComponent>;
  let testComponent: TestAccordionItemComponent;
  let testFixture: ComponentFixture<TestAccordionItemComponent>;
  let element: DebugElement;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AccordionItemComponent, TestAccordionItemComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(AccordionItemComponent);
    component = fixture.componentInstance;
    testFixture = TestBed.createComponent(TestAccordionItemComponent);
    testComponent = testFixture.componentInstance;
    testFixture.detectChanges();
    tick();
    element = testFixture.debugElement.query(By.css('[name=testAccordionItem]'));
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(fixture).toMatchSnapshot();
  });

  it('should populate the accordion item with content provided', fakeAsync(() => {
    testFixture.detectChanges();
    tick();

    expect(element.nativeElement.innerHTML).toEqual('Test');
    expect(testFixture).toMatchSnapshot();
  }));
});

@Component({
  selector: 'test-accordion-item',
  template: ` <p name="testAccordionItem">Test</p> `
})
class TestAccordionItemComponent {}
