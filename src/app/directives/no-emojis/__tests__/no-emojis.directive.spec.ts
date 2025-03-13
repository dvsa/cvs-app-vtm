import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NoEmojisDirective } from '../no-emojis.directive';

@Component({
	template: `<input appNoEmojis [(ngModel)]="testInput">`,
})
class TestComponent {
	testInput = '';
}

describe('NoEmojisDirective', () => {
	let fixture: ComponentFixture<TestComponent>;
	let inputEl: HTMLInputElement;

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [NoEmojisDirective, TestComponent],
			imports: [FormsModule],
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
});
