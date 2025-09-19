import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ApprovalTypeFocusNextDirective } from '../approval-type-focus-next.directive';

@Component({
	template: `
    <input id="first" [characterLimit]="20" appFocusNextApprovalType="next" />
    <input id='next' />
  `,
	imports: [ApprovalTypeFocusNextDirective],
})
class TestComponent {}

describe('ApprovalTypeFocusNext', () => {
	let fixture: ComponentFixture<TestComponent>;
	let component: HTMLInputElement;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [TestComponent],
			providers: [],
		}).compileComponents();

		fixture = TestBed.createComponent(TestComponent);
		fixture.detectChanges();

		component = fixture.debugElement.query(By.directive(ApprovalTypeFocusNextDirective)).nativeElement;
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('onInput', () => {
		it('should, when the value of the input equals the character limit, focus the next element', () => {
			const input: HTMLInputElement = fixture.debugElement.query(By.css('#next')).nativeElement;
			const focusSpy = jest.spyOn(input, 'focus');
			const getElementSpy = jest.spyOn(document, 'getElementById');
			component.value = 'abcdefghijklmnopqrst'; // 20 characters
			component.dispatchEvent(new KeyboardEvent('input', { key: '.' }));
			expect(focusSpy).toHaveBeenCalled();
			expect(getElementSpy).toHaveBeenCalled();
		});

		it('should not attempt to focus any element when the input value is less than the character limit', () => {
			const input: HTMLInputElement = fixture.debugElement.query(By.css('#next')).nativeElement;
			const focusSpy = jest.spyOn(input, 'focus');
			component.value = 'abcdefghijklmnopqrs'; // 19 characters
			component.dispatchEvent(new KeyboardEvent('input', { key: '.' }));
			expect(focusSpy).not.toHaveBeenCalled();
		});
	});
});
