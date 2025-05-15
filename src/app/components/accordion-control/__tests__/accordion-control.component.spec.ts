import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideMockStore } from '@ngrx/store/testing';
import { initialAppState } from '@store/index';
import { AccordionComponent } from '../../accordion/accordion.component';
import { AccordionControlComponent } from '../accordion-control.component';

@Component({
	selector: 'app-host',
	template: `<app-accordion-control>
    <app-accordion id="test" title="Test"> <div id="content">Details</div> </app-accordion>
  </app-accordion-control>`,
	imports: [AccordionControlComponent, AccordionComponent],
})
class HostComponent {}

describe('AccordionControlComponent', () => {
	let component: AccordionControlComponent;
	let fixture: ComponentFixture<HostComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [HostComponent],
			providers: [provideMockStore({ initialState: initialAppState })],
		}).compileComponents();
	});

	beforeEach(async () => {
		fixture = TestBed.createComponent(HostComponent);
		component = fixture.debugElement.query(By.directive(AccordionControlComponent)).componentInstance;
		fixture.detectChanges();
		await fixture.whenRenderingDone();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should open and close child accordions', () => {
		expect(component.accordions?.length).toBe(1);
		expect(component.accordions?.get(0)?.isExpanded()).toBeFalsy();
		component.toggle();
		expect(component.accordions?.get(0)?.isExpanded()).toBeTruthy();
		component.toggle();
		expect(component.accordions?.get(0)?.isExpanded()).toBeFalsy();
	});
});
