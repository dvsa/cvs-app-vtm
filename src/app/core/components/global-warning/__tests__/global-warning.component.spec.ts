import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideMockStore } from '@ngrx/store/testing';
import { initialAppState } from '@store/index';
import { GlobalWarningComponent } from '../global-warning.component';
import { GlobalWarningService } from '../global-warning.service';

@Component({
	selector: 'app-mock-component',
	template: '<app-global-warning></app-global-warning><input id="test-input" type="text" />\n',
	imports: [GlobalWarningComponent],
})
class MockComponent {}

describe('GlobalWarningComponent', () => {
	let component: GlobalWarningComponent;
	let fixture: ComponentFixture<MockComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [MockComponent],
			providers: [GlobalWarningService, provideMockStore({ initialState: initialAppState })],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(MockComponent);
		component = fixture.debugElement.query(By.directive(GlobalWarningComponent)).componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('goto', () => {
		it('should focus element', () => {
			const input: HTMLInputElement = fixture.debugElement.query(By.css('#test-input')).nativeElement;
			component.goto({ warning: 'navigate', anchorLink: 'test-input' });

			expect(document.activeElement).toBe(input);
		});

		it('should do nothing if no anchor link is provided', () => {
			const spy = jest.spyOn(document, 'getElementById');
			component.goto({ warning: 'navigate', anchorLink: undefined });
			expect(spy).not.toHaveBeenCalled();
		});
	});
});
