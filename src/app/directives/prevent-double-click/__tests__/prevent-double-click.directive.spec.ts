import { Component, EventEmitter } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { PreventDoubleClickDirective } from '../prevent-double-click.directive';

@Component({
	selector: 'app-host',
	template: '<button appPreventDoubleClick (clicked)="clicked.emit()"></button>',
	imports: [PreventDoubleClickDirective],
})
class HostComponent {
	clicked = new EventEmitter();
}

describe('PreventDoubleClickDirective', () => {
	let component: HostComponent;
	let fixture: ComponentFixture<HostComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [HostComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(HostComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should emit clicked once', () => {
		const emitSpy = jest.spyOn(component.clicked, 'emit');
		const button: HTMLButtonElement = fixture.debugElement.query(By.css('button')).nativeElement;

		button.click();
		button.click();

		expect(emitSpy).toHaveBeenCalledTimes(1);
	});

	it('should emit clicked twice', async () => {
		const emitSpy = jest.spyOn(component.clicked, 'emit');
		const button: HTMLButtonElement = fixture.debugElement.query(By.css('button')).nativeElement;

		button.click();

		await new Promise<void>((resolve) => {
			const wait = setTimeout(() => {
				clearTimeout(wait);
				button.click();
				resolve();
			}, 1001);
		});

		button.click();

		expect(emitSpy).toHaveBeenCalledTimes(2);
	});
});
