import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NumberOnlyDirective } from '../app-number-only.directive';

@Component({
	template: ' <input type="number" appNumberOnly />',
})
class TestComponent {}

describe('NumberOnlyDirective', () => {
	let fixture: ComponentFixture<TestComponent>;
	let input: HTMLInputElement;

	beforeEach(() => {
		fixture = TestBed.configureTestingModule({
			imports: [NumberOnlyDirective],
			declarations: [TestComponent],
		}).createComponent(TestComponent);
		fixture.detectChanges();

		input = fixture.debugElement.query(By.directive(NumberOnlyDirective)).nativeElement;
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
		const $event = new KeyboardEvent('keydown', { key: '6', cancelable: true });
		expect(input.dispatchEvent($event)).toBe(true);
		expect($event.defaultPrevented).toBe(false);
	});
});
