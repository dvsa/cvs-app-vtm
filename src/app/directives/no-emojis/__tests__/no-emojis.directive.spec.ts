import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, NgControl } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NoEmojisDirective } from '../no-emojis.directive';

@Component({
	template: `<input appNoEmojis [(ngModel)]="testInput">`,
	imports: [NoEmojisDirective, FormsModule],
})
class TestComponent {
	testInput: string | null = '';
}

describe('NoEmojisDirective', () => {
	let fixture: ComponentFixture<TestComponent>;
	let inputEl: HTMLInputElement;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [TestComponent, NoEmojisDirective],
		});

		fixture = TestBed.createComponent(TestComponent);
		fixture.detectChanges();
		inputEl = fixture.debugElement.query(By.directive(NoEmojisDirective)).nativeElement;
	});

	it('should remove emojis from input', () => {
		inputEl.value = 'Hello 😊';
		inputEl.dispatchEvent(new Event('input'));
		fixture.detectChanges();
		expect(inputEl.value).toBe('Hello ');
	});

	it('should not alter input without emojis', () => {
		inputEl.value = 'Hello';
		inputEl.dispatchEvent(new Event('input'));
		fixture.detectChanges();
		expect(inputEl.value).toBe('Hello');
	});

	it('should pass null through the wrapped value accessor', () => {
		const ngControl = fixture.debugElement.query(By.directive(NoEmojisDirective)).injector.get(NgControl);
		const valueAccessor = ngControl.valueAccessor as any;

		expect(() => valueAccessor.onChange(null)).not.toThrow();
		expect(fixture.componentInstance.testInput).toBeNull();
	});
});
