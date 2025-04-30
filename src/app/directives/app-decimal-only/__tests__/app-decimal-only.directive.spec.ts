import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DecimalOnlyDirective } from '../app-decimal-only.directive';

@Component({
	template: ' <input type="number" appDecimalOnly />',
	imports: [DecimalOnlyDirective],
})
class TestComponent {}

describe('DecimalOnlyDirective', () => {
	let fixture: ComponentFixture<TestComponent>;
	let input: HTMLInputElement;

	beforeEach(() => {
		fixture = TestBed.configureTestingModule({
			imports: [TestComponent],
		}).createComponent(TestComponent);
		fixture.detectChanges();

		input = fixture.debugElement.query(By.directive(DecimalOnlyDirective)).nativeElement;
	});
	it('should create an instance', () => {
		expect(input).toBeTruthy();
	});

	it('should prevent default event behaviour if a prohibited key is pressed', () => {
		const $event = new KeyboardEvent('keydown', { key: 'e', cancelable: true });
		expect(input.dispatchEvent($event)).toBe(false);
		expect($event.defaultPrevented).toBe(true);
	});

	it('should not prevent default event behaviour if a prohibited key is pressed', () => {
		const $event1 = new KeyboardEvent('keydown', { key: '6', cancelable: true });
		expect(input.dispatchEvent($event1)).toBe(true);
		expect($event1.defaultPrevented).toBe(false);

		const $event2 = new KeyboardEvent('keydown', { key: '.', cancelable: true });
		expect(input.dispatchEvent($event2)).toBe(true);
		expect($event2.defaultPrevented).toBe(false);
	});
});
