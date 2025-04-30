import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { State, initialAppState } from '@store/index';
import { addSectionState, removeSectionState } from '@store/technical-records';
import { AccordionComponent } from '../accordion.component';

@Component({
	selector: 'app-host',
	template: '<app-accordion id="test" title="Test"> <div id="content">Details</div> </app-accordion>',
	imports: [AccordionComponent],
})
class HostComponent {}

describe('AccordionComponent', () => {
	let component: AccordionComponent;
	let fixture: ComponentFixture<HostComponent>;
	let store: MockStore<State>;
	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [HostComponent],
			providers: [provideMockStore({ initialState: initialAppState })],
		}).compileComponents();
		store = TestBed.inject(MockStore);
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
		expect(component.isExpanded()).toBeTruthy();

		button.click();
		expect(component.isExpanded()).toBeFalsy();
	});

	it('should set expanded value to true', () => {
		const markForCheckSpy = jest.spyOn(component['cdr'], 'markForCheck');
		const dispatchSpy = jest.spyOn(store, 'dispatch');

		component.open('TEST_SECTION');
		expect(component.isExpanded).toBeTruthy();
		expect(markForCheckSpy).toHaveBeenCalledTimes(1);
		expect(dispatchSpy).toHaveBeenCalledTimes(1);
		expect(dispatchSpy).toHaveBeenCalledWith(addSectionState({ section: 'TEST_SECTION' }));
	});

	it('should set expanded value to false', () => {
		const markForCheckSpy = jest.spyOn(component['cdr'], 'markForCheck');
		const dispatchSpy = jest.spyOn(store, 'dispatch');

		component.isExpanded.set(true);
		component.close('TEST_SECTION');
		expect(component.isExpanded()).toBeFalsy();
		expect(markForCheckSpy).toHaveBeenCalledTimes(1);
		expect(dispatchSpy).toHaveBeenCalledTimes(1);
		expect(dispatchSpy).toHaveBeenCalledWith(removeSectionState({ section: 'TEST_SECTION' }));
	});
});
